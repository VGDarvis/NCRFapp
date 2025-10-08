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
            content: `You are an educational search assistant for colleges, high schools, scholarships, and youth sports programs. Parse natural language queries and extract structured filters.

Extract these fields (return null if not mentioned):
- search_type: "schools" | "scholarships" | "youth_services" | "all" (default: "all")
- institution_type: "college" | "high_school" | "all" | null (for schools search)
- school_type: "HBCU" | "Public" | "Private" | "Community College" | "High School" | null
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
- sports_programs: string[] | null (e.g., ["Basketball", "Football", "Soccer"])
- age_ranges: string[] | null (e.g., ["5-10", "11-14", "15-18"])
- service_type: "Sports" | "Mentorship" | "STEM" | "After-School" | "Arts" | "Community Center" | "Tutoring" | null

Detection hints:
- "high school", "secondary school", "prep school" → set institution_type: "high_school"
- "AAU", "youth league", "sports program", "youth sports" → set search_type: "youth_services"
- "college", "university" → set institution_type: "college"

Return ONLY valid JSON with these fields. Be smart about synonyms (e.g., "California" → "CA", "engineering" → "Engineering", "basketball" → "Basketball").`
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

    // Search schools (colleges and high schools)
    let schools = [];
    let highSchools = [];
    
    if (filters.search_type === 'schools' || filters.search_type === 'all' || !filters.search_type) {
      const institutionType = filters.institution_type || 'all';
      
      // Search colleges/universities
      if (institutionType === 'college' || institutionType === 'all') {
        let schoolQuery = supabase.from('school_database').select('*').neq('school_type', 'High School');

        if (filters.school_type && filters.school_type !== 'High School') {
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
        if (filters.sports_programs && filters.sports_programs.length > 0) {
          schoolQuery = schoolQuery.overlaps('athletic_programs', filters.sports_programs);
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
      
      // Search high schools
      if (institutionType === 'high_school' || institutionType === 'all') {
        let highSchoolQuery = supabase.from('school_database').select('*').eq('school_type', 'High School');

        if (filters.state) {
          highSchoolQuery = highSchoolQuery.eq('state', filters.state);
        }
        if (filters.region) {
          highSchoolQuery = highSchoolQuery.eq('region', filters.region);
        }
        if (filters.city) {
          highSchoolQuery = highSchoolQuery.ilike('city', `%${filters.city}%`);
        }
        if (filters.sports_programs && filters.sports_programs.length > 0) {
          highSchoolQuery = highSchoolQuery.overlaps('athletic_programs', filters.sports_programs);
        }

        const { data, error } = await highSchoolQuery.limit(50);
        if (!error) highSchools = data || [];
      }
    }

    // Search scholarships
    let scholarships = [];
    if (filters.search_type === 'scholarships' || filters.search_type === 'all' || !filters.search_type) {
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

    // Search youth services
    let youthServices = [];
    if (filters.search_type === 'youth_services' || filters.search_type === 'all' || !filters.search_type) {
      let youthQuery = supabase.from('youth_services_database').select('*').eq('is_active', true);

      if (filters.service_type) {
        youthQuery = youthQuery.eq('service_type', filters.service_type);
      }
      if (filters.state) {
        youthQuery = youthQuery.eq('state', filters.state);
      }
      if (filters.region) {
        youthQuery = youthQuery.eq('region', filters.region);
      }
      if (filters.city) {
        youthQuery = youthQuery.ilike('city', `%${filters.city}%`);
      }
      if (filters.sports_programs && filters.sports_programs.length > 0) {
        youthQuery = youthQuery.overlaps('sports_offered', filters.sports_programs);
      }
      if (filters.age_ranges && filters.age_ranges.length > 0) {
        youthQuery = youthQuery.overlaps('age_ranges', filters.age_ranges);
      }

      const { data, error } = await youthQuery.limit(50);
      if (!error) youthServices = data || [];
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

    const totalResults = schools.length + highSchools.length + scholarships.length + youthServices.length;

    await supabase.from('ai_search_queries').insert({
      query_text: query,
      parsed_filters: filters,
      results_count: totalResults,
      search_duration_ms: duration,
      user_id: userId,
    });

    return new Response(
      JSON.stringify({
        filters,
        schools,
        high_schools: highSchools,
        scholarships,
        youth_services: youthServices,
        total_results: totalResults,
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