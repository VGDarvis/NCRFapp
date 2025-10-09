import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SearchFilters {
  search_type?: 'schools' | 'scholarships' | 'youth_services' | 'all';
  institution_type?: 'college' | 'high_school' | 'all';
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
  sports_programs?: string[];
  age_ranges?: string[];
  service_type?: string;
}

export interface SearchResult {
  filters: SearchFilters;
  schools: any[];
  high_schools: any[];
  scholarships: any[];
  youth_services: any[];
  total_results: number;
  duration_ms: number;
  using_fallback?: boolean;
  search_message?: string;
  search_expanded?: boolean;
  search_explanation?: {
    total: number;
    breakdown: {
      high_schools: number;
      colleges: number;
      scholarships: number;
      youth_services: number;
    };
    query_details?: {
      searched_county: string | null;
      searched_cities: number | null;
      searched_state: string | null;
      search_method: string;
    };
  };
  did_you_mean?: {
    suggestion: string;
    reason: string;
  };
}

// Simple in-memory cache with 5-minute TTL
const searchCache = new Map<string, { data: SearchResult; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Track in-flight requests to prevent duplicates
const inFlightRequests = new Map<string, Promise<SearchResult>>();

export function useAISearch() {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    const cacheKey = query.toLowerCase().trim();
    
    // Check cache first
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Using cached results for:', query);
      setResults(cached.data);
      return;
    }

    // Check for duplicate in-flight request
    const inFlight = inFlightRequests.get(cacheKey);
    if (inFlight) {
      console.log('Duplicate request detected, waiting for in-flight request');
      try {
        const data = await inFlight;
        setResults(data);
        return;
      } catch (err) {
        // Fall through to new request
      }
    }

    setIsLoading(true);
    setError(null);

    const searchPromise = (async () => {
      try {
        const { data, error: functionError } = await supabase.functions.invoke('ai-search', {
          body: { query },
        });

        if (functionError) throw functionError;

        // Cache successful results
        searchCache.set(cacheKey, { data, timestamp: Date.now() });
        
        // Show notice if using fallback
        if (data.using_fallback) {
          setError('Using simplified search (AI service busy)');
        }

        setResults(data);
        return data;
      } catch (err) {
        console.error('Search error:', err);
        const errorMsg = err instanceof Error ? err.message : 'Search failed';
        
        if (errorMsg.includes('429') || errorMsg.includes('rate limit')) {
          setError('Search service is busy. Please try again in a moment.');
        } else {
          setError(errorMsg);
        }
        
        setResults(null);
        throw err;
      } finally {
        setIsLoading(false);
        inFlightRequests.delete(cacheKey);
      }
    })();

    inFlightRequests.set(cacheKey, searchPromise);
    
    try {
      await searchPromise;
    } catch {
      // Error already handled above
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