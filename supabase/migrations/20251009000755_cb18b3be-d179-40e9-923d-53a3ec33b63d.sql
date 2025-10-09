-- Create cache table for web search results
CREATE TABLE IF NOT EXISTS public.web_search_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_key TEXT UNIQUE NOT NULL,
  results JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_web_search_cache_key ON public.web_search_cache(search_key);
CREATE INDEX IF NOT EXISTS idx_web_search_cache_expires ON public.web_search_cache(expires_at);

-- Enable RLS
ALTER TABLE public.web_search_cache ENABLE ROW LEVEL SECURITY;

-- Allow system to manage cache
CREATE POLICY "System can manage cache"
ON public.web_search_cache
FOR ALL
USING (true);

-- Auto-delete expired cache entries
CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.web_search_cache WHERE expires_at < NOW();
END;
$$;