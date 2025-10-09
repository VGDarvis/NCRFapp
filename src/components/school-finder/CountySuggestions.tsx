import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface County {
  county_name: string;
  state_code: string;
  cities: string[];
}

interface CountySuggestionsProps {
  searchQuery: string;
  onSelectCounty: (county: string) => void;
}

export function CountySuggestions({ searchQuery, onSelectCounty }: CountySuggestionsProps) {
  const [suggestions, setSuggestions] = useState<County[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCounties = async () => {
      // Only show suggestions when "county" is in the query
      if (!searchQuery.toLowerCase().includes('county') || searchQuery.length < 3) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      
      // Extract the county name from the query (remove "county" keyword)
      const countySearch = searchQuery
        .toLowerCase()
        .replace(/county/gi, '')
        .replace(/schools?/gi, '')
        .trim();

      if (countySearch.length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('counties')
        .select('county_name, state_code, cities')
        .ilike('county_name', `%${countySearch}%`)
        .limit(5);
      
      if (!error && data) {
        setSuggestions(data);
      }
      
      setIsLoading(false);
    };
    
    const debounce = setTimeout(() => {
      fetchCounties();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  if (suggestions.length === 0 || isLoading) return null;

  return (
    <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200">
      <p className="text-sm font-medium mb-2 flex items-center gap-2 text-foreground">
        <MapPin className="w-4 h-4 text-primary" />
        County Suggestions:
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((county) => (
          <Badge
            key={`${county.county_name}-${county.state_code}`}
            variant="outline"
            className="cursor-pointer hover:bg-primary/10 transition-colors"
            onClick={() => onSelectCounty(`${county.county_name} schools`)}
          >
            {county.county_name}, {county.state_code}
            <span className="ml-1 text-xs text-muted-foreground">
              ({county.cities.length} cities)
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
