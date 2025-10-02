import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, ExternalLink, Calendar, DollarSign } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface Booklet {
  id: string;
  title: string;
  description: string | null;
  category: string;
  academic_year: string;
  total_scholarships: number;
  total_value: number;
  pdf_url: string | null;
}

interface Scholarship {
  id: string;
  title: string;
  provider_name: string;
  amount_min: number | null;
  amount_max: number | null;
  deadline: string;
  application_url: string;
}

interface BookletDetailDialogProps {
  booklet: Booklet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: () => void;
  user: User | null;
}

export function BookletDetailDialog({
  booklet,
  open,
  onOpenChange,
  onDownload,
  user,
}: BookletDetailDialogProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchBookletScholarships();
    }
  }, [open, booklet.id]);

  const fetchBookletScholarships = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("booklet_scholarships")
        .select(`
          scholarship_id,
          scholarship_opportunities (
            id,
            title,
            provider_name,
            amount_min,
            amount_max,
            deadline,
            application_url
          )
        `)
        .eq("booklet_id", booklet.id)
        .order("display_order");

      if (error) throw error;

      const scholarshipData = data
        ?.map((item: any) => item.scholarship_opportunities)
        .filter(Boolean) as Scholarship[];

      setScholarships(scholarshipData || []);
    } catch (error) {
      console.error("Error fetching booklet scholarships:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "Varies";
    if (min && max && min !== max) {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
    if (min) return `$${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return "Varies";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{booklet.title}</DialogTitle>
          <DialogDescription>
            {booklet.description}
          </DialogDescription>
          <div className="flex gap-2 pt-2">
            <Badge variant="outline" className="capitalize">{booklet.category}</Badge>
            <Badge variant="outline">{booklet.academic_year}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Total Scholarships</div>
              <div className="text-2xl font-bold">{booklet.total_scholarships}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Total Value</div>
              <div className="text-2xl font-bold text-primary">
                ${(booklet.total_value / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>

          {/* Scholarships List */}
          <div>
            <h3 className="font-semibold mb-3">Included Scholarships</h3>
            <ScrollArea className="h-[300px] pr-4">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {scholarships.map((scholarship) => (
                    <div
                      key={scholarship.id}
                      className="p-4 border rounded-lg hover:border-primary transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold">{scholarship.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {scholarship.provider_name}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(scholarship.application_url, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-muted-foreground" />
                          <span>{formatAmount(scholarship.amount_min, scholarship.amount_max)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span>{formatDate(scholarship.deadline)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onDownload} disabled={!booklet.pdf_url}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
