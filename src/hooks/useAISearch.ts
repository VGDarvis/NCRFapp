import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SearchFilters {
  search_type?: 'schools' | 'scholarships' | 'both';
  school_type?: string;
  state?: string;
  region?: string;
  city?: string;
  programs?: string[];
  min_enrollment?: number;
  max_enrollment?: number;
  max_acceptance_rate?: number;
  scholarship_min_amount?: number;
  scholarship_max_amount?: number;
  gpa_requirement?: number;
  demographics?: string[];
  athletic_division?: string;
}

export interface SearchResult {
  filters: SearchFilters;
  schools: any[];
  scholarships: any[];
  total_results: number;
  duration_ms: number;
}

export function useAISearch() {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('ai-search', {
        body: { query },
      });

      if (functionError) throw functionError;

      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    search,
    reset,
  };
}