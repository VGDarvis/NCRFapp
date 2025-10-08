import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays, format } from "date-fns";

interface SearchAnalytics {
  totalSearches: number;
  uniqueUsers: number;
  avgDuration: number;
  successRate: number;
  zeroResultSearches: number;
}

interface TopQuery {
  query_text: string;
  count: number;
  avg_results: number;
}

interface SearchOverTime {
  date: string;
  searches: number;
}

interface DatabaseHealth {
  totalSchools: number;
  verifiedSchools: number;
  totalServices: number;
  verifiedServices: number;
}

export function useSearchAnalytics(fromDate: Date, toDate: Date) {
  return useQuery({
    queryKey: ["education-analytics", "searches", fromDate, toDate],
    queryFn: async (): Promise<SearchAnalytics> => {
      const { data, error } = await supabase
        .from("ai_search_queries")
        .select("search_duration_ms, results_count, user_id")
        .gte("created_at", fromDate.toISOString())
        .lte("created_at", toDate.toISOString());

      if (error) throw error;

      const totalSearches = data?.length || 0;
      const uniqueUsers = new Set(data?.map((d) => d.user_id).filter(Boolean)).size;
      const avgDuration = data?.length
        ? data.reduce((sum, d) => sum + (d.search_duration_ms || 0), 0) / data.length
        : 0;
      const successfulSearches = data?.filter((d) => d.results_count > 0).length || 0;
      const successRate = totalSearches > 0 ? (successfulSearches / totalSearches) * 100 : 0;
      const zeroResultSearches = totalSearches - successfulSearches;

      return {
        totalSearches,
        uniqueUsers,
        avgDuration: Math.round(avgDuration),
        successRate: Math.round(successRate * 10) / 10,
        zeroResultSearches,
      };
    },
  });
}

export function useTopQueries(limit = 10) {
  return useQuery({
    queryKey: ["education-analytics", "top-queries", limit],
    queryFn: async (): Promise<TopQuery[]> => {
      // Manual aggregation of queries
      const { data: queries, error: queryError } = await supabase
        .from("ai_search_queries")
        .select("query_text, results_count");

      if (queryError) throw queryError;

      const queryMap = new Map<string, { count: number; totalResults: number }>();
      queries?.forEach((q) => {
        const existing = queryMap.get(q.query_text) || { count: 0, totalResults: 0 };
        queryMap.set(q.query_text, {
          count: existing.count + 1,
          totalResults: existing.totalResults + (q.results_count || 0),
        });
      });

      return Array.from(queryMap.entries())
        .map(([query_text, stats]) => ({
          query_text,
          count: stats.count,
          avg_results: stats.totalResults / stats.count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    },
  });
}

export function useSearchesOverTime(fromDate: Date, toDate: Date) {
  return useQuery({
    queryKey: ["education-analytics", "searches-over-time", fromDate, toDate],
    queryFn: async (): Promise<SearchOverTime[]> => {
      const { data, error } = await supabase
        .from("ai_search_queries")
        .select("created_at")
        .gte("created_at", fromDate.toISOString())
        .lte("created_at", toDate.toISOString())
        .order("created_at");

      if (error) throw error;

      const dateMap = new Map<string, number>();
      data?.forEach((record) => {
        const date = format(new Date(record.created_at), "yyyy-MM-dd");
        dateMap.set(date, (dateMap.get(date) || 0) + 1);
      });

      return Array.from(dateMap.entries())
        .map(([date, searches]) => ({ date, searches }))
        .sort((a, b) => a.date.localeCompare(b.date));
    },
  });
}

export function useZeroResultQueries() {
  return useQuery({
    queryKey: ["education-analytics", "zero-results"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_search_queries")
        .select("query_text, parsed_filters, created_at")
        .eq("results_count", 0)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    },
  });
}

export function useDatabaseHealth() {
  return useQuery({
    queryKey: ["education-analytics", "database-health"],
    queryFn: async (): Promise<DatabaseHealth> => {
      const [schoolsResult, servicesResult] = await Promise.all([
        supabase.from("school_database").select("verification_status", { count: "exact" }),
        supabase.from("youth_services_database").select("verification_status", { count: "exact" }),
      ]);

      if (schoolsResult.error) throw schoolsResult.error;
      if (servicesResult.error) throw servicesResult.error;

      const verifiedSchools =
        schoolsResult.data?.filter((s) => s.verification_status === "verified").length || 0;
      const verifiedServices =
        servicesResult.data?.filter((s) => s.verification_status === "verified").length || 0;

      return {
        totalSchools: schoolsResult.count || 0,
        verifiedSchools,
        totalServices: servicesResult.count || 0,
        verifiedServices,
      };
    },
  });
}

export function useAllSearchQueries(fromDate: Date, toDate: Date) {
  return useQuery({
    queryKey: ["education-analytics", "all-queries", fromDate, toDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_search_queries")
        .select("*")
        .gte("created_at", fromDate.toISOString())
        .lte("created_at", toDate.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });
}
