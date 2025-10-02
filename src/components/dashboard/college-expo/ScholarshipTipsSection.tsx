import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Tip {
  id: string;
  title: string;
  content: string;
  category: string;
  display_order: number;
  icon_name: string | null;
}

const categoryLabels: Record<string, string> = {
  application_tips: "Application Tips",
  essay_writing: "Essay Writing",
  interview_prep: "Interview Preparation",
  organization: "Organization & Planning",
};

const categoryDescriptions: Record<string, string> = {
  application_tips: "Essential strategies for submitting strong applications",
  essay_writing: "Tips for crafting compelling scholarship essays",
  interview_prep: "Prepare effectively for scholarship interviews",
  organization: "Stay organized throughout the application process",
};

export function ScholarshipTipsSection() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const { data, error } = await supabase
        .from("scholarship_tips")
        .select("*")
        .order("category")
        .order("display_order");

      if (error) throw error;
      setTips(data || []);
    } catch (error) {
      console.error("Error fetching tips:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string | null): LucideIcon => {
    if (!iconName) return Icons.Lightbulb;
    const Icon = (Icons as any)[iconName];
    return Icon || Icons.Lightbulb;
  };

  const groupedTips = tips.reduce((acc, tip) => {
    if (!acc[tip.category]) {
      acc[tip.category] = [];
    }
    acc[tip.category].push(tip);
    return acc;
  }, {} as Record<string, Tip[]>);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3 mb-2" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl font-bold mb-3">Scholarship Success Tips</h2>
        <p className="text-muted-foreground">
          Expert advice to help you navigate the scholarship application process and maximize your chances of success.
        </p>
      </div>

      <div className="grid gap-6">
        {Object.entries(groupedTips).map(([category, categoryTips]) => {
          const Icon = getIcon(categoryTips[0]?.icon_name);
          
          return (
            <Card key={category}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>{categoryLabels[category] || category}</CardTitle>
                    <CardDescription>
                      {categoryDescriptions[category] || ""}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{categoryTips.length} Tips</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {categoryTips.map((tip, index) => {
                    const TipIcon = getIcon(tip.icon_name);
                    return (
                      <AccordionItem key={tip.id} value={`tip-${tip.id}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <TipIcon className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="font-semibold">{tip.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-7 pt-2 text-muted-foreground">
                            {tip.content}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
