import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, BookOpen, Eye, Sparkles, Award, DollarSign, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BookletDetailDialog } from "./BookletDetailDialog";
import { BookletViewerDialog } from "./BookletViewerDialog";
import type { User } from "@supabase/supabase-js";

interface Booklet {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  pdf_url: string | null;
  viewer_url: string | null;
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
  const [viewerBooklet, setViewerBooklet] = useState<Booklet | null>(null);
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

  const handleViewBooklet = async (booklet: Booklet) => {
    if (!booklet.viewer_url) return;

    try {
      // Track view
      await supabase.from("booklet_downloads").insert({
        booklet_id: booklet.id,
        user_id: user?.id || null,
      });

      // Update view count
      await supabase
        .from("scholarship_booklets")
        .update({ download_count: booklet.download_count + 1 })
        .eq("id", booklet.id);

      setBooklets(booklets.map(b => 
        b.id === booklet.id 
          ? { ...b, download_count: b.download_count + 1 }
          : b
      ));

      setViewerBooklet(booklet);
    } catch (error) {
      console.error("Error opening viewer:", error);
      toast({
        title: "Error",
        description: "Failed to open booklet viewer",
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse border-2">
            <div className="h-64 md:h-72 bg-muted" />
            <CardHeader>
              <div className="h-7 bg-muted rounded mb-2" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="h-24 bg-muted rounded" />
            </CardContent>
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredBooklets.map((booklet) => (
          <Card 
            key={booklet.id} 
            className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30 relative"
          >
            {/* Download Button - Top Right Floating */}
            <Button
              size="icon"
              onClick={() => handleDownload(booklet)}
              disabled={!booklet.pdf_url}
              className="absolute top-4 right-4 z-10 bg-background/95 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform"
            >
              <Download className="w-4 h-4" />
            </Button>

            {/* Cover Image */}
            <div className="relative h-64 md:h-72 overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-border">
              {booklet.cover_image_url ? (
                <img
                  src={booklet.cover_image_url}
                  alt={`${booklet.title} cover`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 shadow-inner"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
              
              {booklet.featured && (
                <Badge className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 rounded-bl-lg shadow-lg border-l border-b border-accent-foreground/20">
                  <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
                  Featured
                </Badge>
              )}
            </div>

            <CardHeader className="bg-background/95 backdrop-blur-sm border-t-2 border-primary/10 pb-4 relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className="bg-primary text-primary-foreground capitalize">
                  {booklet.category}
                </Badge>
                {booklet.academic_year && (
                  <Badge variant="outline" className="bg-accent/10">
                    {booklet.academic_year}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl md:text-2xl font-bold pr-32 line-clamp-2">{booklet.title}</CardTitle>
              <CardDescription className="line-clamp-2 leading-relaxed">
                {booklet.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 rounded-lg p-3 text-center group/stat hover:bg-primary/10 transition-colors">
                  <Award className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{booklet.total_scholarships}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Scholarships</div>
                </div>
                <div className="bg-primary/5 rounded-lg p-3 text-center group/stat hover:bg-primary/10 transition-colors">
                  <DollarSign className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{formatCurrency(booklet.total_value)}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Total Value</div>
                </div>
                <div className="bg-primary/5 rounded-lg p-3 text-center group/stat hover:bg-primary/10 transition-colors">
                  <Download className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{booklet.download_count}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Downloads</div>
                </div>
                <div className="bg-primary/5 rounded-lg p-3 text-center group/stat hover:bg-primary/10 transition-colors">
                  <Calendar className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{booklet.download_count}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Views</div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-0 pb-6">
              <Button
                className="w-full btn-gold hover:scale-105 transition-transform font-semibold"
                onClick={() => handleViewBooklet(booklet)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Read Now
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
          onViewBooklet={() => handleViewBooklet(selectedBooklet)}
          user={user}
        />
      )}

      {/* Viewer Dialog */}
      <BookletViewerDialog
        booklet={viewerBooklet}
        open={!!viewerBooklet}
        onOpenChange={(open) => !open && setViewerBooklet(null)}
      />
    </div>
  );
}
