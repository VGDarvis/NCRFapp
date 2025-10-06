import { supabase } from "@/integrations/supabase/client";

export async function calculateBookletScholarshipTotals() {
  const { data, error } = await supabase
    .from('scholarship_booklets')
    .select('total_scholarships, total_value')
    .eq('status', 'published');
  
  if (error || !data) {
    return { totalScholarships: 0, totalValue: 0 };
  }
  
  const totalScholarships = data.reduce((sum, booklet) => 
    sum + (booklet.total_scholarships || 0), 0
  );
  
  const totalValue = data.reduce((sum, booklet) => 
    sum + (booklet.total_value || 0), 0
  );
  
  return { totalScholarships, totalValue };
}

export function formatCurrency(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value}`;
}
