import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    const startTime = Date.now();

    // Get AI to parse the query
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a college and scholarship search assistant. Parse natural language queries and extract structured filters.

Extract these fields (return null if not mentioned):
- search_type: "schools" | "scholarships" | "both"
- school_type: "HBCU" | "Public" | "Private" | "Community College" | null
- state: string | null (e.g., "CA", "TX")
- region: "West" | "South" | "Midwest" | "Northeast" | null
- city: string | null
- programs: string[] (e.g., ["Engineering", "Business"])
- min_enrollment: number | null
- max_enrollment: number | null
- max_acceptance_rate: number | null
- scholarship_min_amount: number | null
- scholarship_max_amount: number | null
- gpa_requirement: number | null
- demographics: string[] (e.g., ["African American", "Women"])
- athletic_division: "I" | "II" | "III" | null

Return ONLY valid JSON with these fields. Be smart about synonyms (e.g., "California" → "CA", "engineering" → "Engineering").`
          },
          {
            role: 'user',
            content: query
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI parsing failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const filters = JSON.parse(aiData.choices[0].message.content);

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search schools
    let schools = [];
    if (filters.search_type === 'schools' || filters.search_type === 'both') {
      let schoolQuery = supabase.from('school_database').select('*');

      if (filters.school_type) {
        schoolQuery = schoolQuery.eq('school_type', filters.school_type);
      }
      if (filters.state) {
        schoolQuery = schoolQuery.eq('state', filters.state);
      }
      if (filters.region) {
        schoolQuery = schoolQuery.eq('region', filters.region);
      }
      if (filters.city) {
        schoolQuery = schoolQuery.ilike('city', `%${filters.city}%`);
      }
      if (filters.programs && filters.programs.length > 0) {
        schoolQuery = schoolQuery.overlaps('programs_offered', filters.programs);
      }
      if (filters.min_enrollment) {
        schoolQuery = schoolQuery.gte('total_enrollment', filters.min_enrollment);
      }
      if (filters.max_enrollment) {
        schoolQuery = schoolQuery.lte('total_enrollment', filters.max_enrollment);
      }
      if (filters.max_acceptance_rate) {
        schoolQuery = schoolQuery.lte('acceptance_rate', filters.max_acceptance_rate);
      }
      if (filters.athletic_division) {
        schoolQuery = schoolQuery.eq('athletic_division', filters.athletic_division);
      }

      const { data, error } = await schoolQuery.limit(50);
      if (!error) schools = data || [];
    }

    // Search scholarships
    let scholarships = [];
    if (filters.search_type === 'scholarships' || filters.search_type === 'both') {
      let scholarshipQuery = supabase.from('scholarship_opportunities').select('*');

      if (filters.scholarship_min_amount) {
        scholarshipQuery = scholarshipQuery.gte('amount_max', filters.scholarship_min_amount);
      }
      if (filters.scholarship_max_amount) {
        scholarshipQuery = scholarshipQuery.lte('amount_max', filters.scholarship_max_amount);
      }
      if (filters.gpa_requirement) {
        scholarshipQuery = scholarshipQuery.lte('gpa_requirement', filters.gpa_requirement);
      }
      if (filters.demographics && filters.demographics.length > 0) {
        scholarshipQuery = scholarshipQuery.overlaps('demographic_requirements', filters.demographics);
      }
      if (filters.programs && filters.programs.length > 0) {
        scholarshipQuery = scholarshipQuery.overlaps('major_restrictions', filters.programs);
      }

      const { data, error } = await scholarshipQuery.eq('status', 'active').limit(50);
      if (!error) scholarships = data || [];
    }

    const duration = Date.now() - startTime;

    // Log search query
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    await supabase.from('ai_search_queries').insert({
      query_text: query,
      parsed_filters: filters,
      results_count: schools.length + scholarships.length,
      search_duration_ms: duration,
      user_id: userId,
    });

    return new Response(
      JSON.stringify({
        filters,
        schools,
        scholarships,
        total_results: schools.length + scholarships.length,
        duration_ms: duration,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('AI search error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Search failed' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});