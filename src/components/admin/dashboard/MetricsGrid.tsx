import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "../shared/StatsCard";
import { Users, MessageSquare, Briefcase, Target, TrendingUp, Activity } from "lucide-react";

export function MetricsGrid() {
  const [metrics, setMetrics] = useState({
    totalStaff: 0,
    activeCrmContacts: 0,
    messagesSentWeek: 0,
    activeCampaigns: 0,
    pendingHrTasks: 0,
    outreachSuccessRate: 0,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      // Fetch from analytics_summary table for aggregated data
      const { data: summaryData } = await supabase
        .from('analytics_summary')
        .select('*')
        .order('summary_date', { ascending: false })
        .limit(1)
        .single();

      if (summaryData) {
        setMetrics({
          totalStaff: summaryData.total_employees || 0,
          activeCrmContacts: summaryData.active_crm_contacts || 0,
          messagesSentWeek: summaryData.messages_sent_week || 0,
          activeCampaigns: summaryData.active_campaigns || 0,
          pendingHrTasks: summaryData.pending_hr_tasks || 0,
          outreachSuccessRate: Number(summaryData.outreach_success_rate) || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatsCard
        title="Total Staff"
        value={metrics.totalStaff}
        description="Active employees"
        icon={Users}
      />
      <StatsCard
        title="Active CRM Contacts"
        value={metrics.activeCrmContacts}
        description="Organizations & individuals"
        icon={Target}
      />
      <StatsCard
        title="Messages This Week"
        value={metrics.messagesSentWeek}
        description="Outreach communications"
        icon={MessageSquare}
      />
      <StatsCard
        title="Active Campaigns"
        value={metrics.activeCampaigns}
        description="Ongoing outreach efforts"
        icon={TrendingUp}
      />
      <StatsCard
        title="Pending HR Tasks"
        value={metrics.pendingHrTasks}
        description="Onboarding & reviews"
        icon={Briefcase}
      />
      <StatsCard
        title="Outreach Success Rate"
        value={`${metrics.outreachSuccessRate.toFixed(1)}%`}
        description="Response rate"
        icon={Activity}
        trend={{
          value: 12.5,
          isPositive: true,
        }}
      />
    </div>
  );
}
