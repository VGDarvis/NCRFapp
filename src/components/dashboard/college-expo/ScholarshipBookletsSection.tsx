import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, BookOpen, Eye, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BookletDetailDialog } from "./BookletDetailDialog";
import type { User } from "@supabase/supabase-js";

interface Booklet {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  pdf_url: string | null;
  category: string;
  academic_year: string;
  total_scholarships: number;
  total_value: number;
  featured: boolean;
  download_count: number;
}

interface ScholarshipBookletsSectionProps {
  user: User | null;
}

export function ScholarshipBookletsSection({ user }: ScholarshipBookletsSectionProps) {
  const [booklets, setBooklets] = useState<Booklet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooklet, setSelectedBooklet] = useState<Booklet | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchBooklets();
  }, []);

  const fetchBooklets = async () => {
    try {
      const { data, error } = await supabase
        .from("scholarship_booklets")
        .select("*")
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("published_date", { ascending: false });

      if (error) throw error;
      setBooklets(data || []);
    } catch (error) {
      console.error("Error fetching booklets:", error);
      toast({
        title: "Error",
        description: "Failed to load scholarship booklets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (booklet: Booklet) => {
    if (!booklet.pdf_url) {
      toast({
        title: "Not Available",
        description: "PDF is not available for this booklet",
        variant: "destructive",
      });
      return;
    }

    try {
      // Track download
      await supabase.from("booklet_downloads").insert({
        booklet_id: booklet.id,
        user_id: user?.id || null,
      });

      // Update download count
      await supabase
        .from("scholarship_booklets")
        .update({ download_count: booklet.download_count + 1 })
        .eq("id", booklet.id);

      // Open PDF in new tab
      window.open(booklet.pdf_url, "_blank");

      toast({
        title: "Download Started",
        description: "Your scholarship booklet is opening",
      });
    } catch (error) {
      console.error("Error tracking download:", error);
      toast({
        title: "Error",
        description: "Failed to download booklet",
        variant: "destructive",
      });
    }
  };

  const categories = ["all", ...Array.from(new Set(booklets.map(b => b.category)))];
  const filteredBooklets = filterCategory === "all" 
    ? booklets 
    : booklets.filter(b => b.category === filterCategory);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted" />
            <CardHeader>
              <div className="h-6 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={filterCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Booklets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooklets.map((booklet) => (
          <Card key={booklet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Cover Image */}
            <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
              {booklet.cover_image_url ? (
                <img
                  src={booklet.cover_image_url}
                  alt={booklet.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <BookOpen className="w-20 h-20 text-primary/30" />
                </div>
              )}
              {booklet.featured && (
                <Badge className="absolute top-2 right-2 bg-accent">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-lg line-clamp-2">{booklet.title}</CardTitle>
              </div>
              <CardDescription className="line-clamp-2">
                {booklet.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Scholarships:</span>
                  <span className="font-semibold">{booklet.total_scholarships}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Value:</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(booklet.total_value)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Downloads:</span>
                  <span className="font-semibold">{booklet.download_count}</span>
                </div>
                <Badge variant="outline" className="capitalize">
                  {booklet.category}
                </Badge>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedBooklet(booklet)}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleDownload(booklet)}
                disabled={!booklet.pdf_url}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredBooklets.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Booklets Found</h3>
          <p className="text-muted-foreground">
            No scholarship booklets available in this category yet.
          </p>
        </div>
      )}

      {/* Detail Dialog */}
      {selectedBooklet && (
        <BookletDetailDialog
          booklet={selectedBooklet}
          open={!!selectedBooklet}
          onOpenChange={(open) => !open && setSelectedBooklet(null)}
          onDownload={() => handleDownload(selectedBooklet)}
          user={user}
        />
      )}
    </div>
  );
}
