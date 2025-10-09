import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SchoolData {
  name: string;
  city: string;
  state: string;
  address?: string;
  website?: string;
}

interface EnrichedData {
  enrollment?: number;
  programs_offered?: string[];
  athletic_programs?: string[];
  demographics?: {
    student_teacher_ratio?: string;
    minority_enrollment?: string;
  };
  contact_info?: {
    phone?: string;
    email?: string;
  };
  school_type?: string;
  notes?: string;
  confidence_score?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { schoolData }: { schoolData: SchoolData } = await req.json();
    console.log('🤖 Enriching school data for:', schoolData.name);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const prompt = `Analyze this school and extract detailed information. Return ONLY valid JSON, no markdown or explanation.

School: ${schoolData.name}
Location: ${schoolData.city}, ${schoolData.state}
${schoolData.address ? `Address: ${schoolData.address}` : ''}
${schoolData.website ? `Website: ${schoolData.website}` : ''}

Extract and return this exact JSON structure:
{
  "enrollment": <number or null>,
  "programs_offered": [<array of program names like "STEM", "Arts", "Business">],
  "athletic_programs": [<array of sports like "Football", "Basketball", "Track">],
  "demographics": {
    "student_teacher_ratio": "<ratio like 15:1 or null>",
    "minority_enrollment": "<percentage or null>"
  },
  "contact_info": {
    "phone": "<phone number or null>",
    "email": "<email or null>"
  },
  "school_type": "<high_school, middle_school, or elementary>",
  "notes": "<brief summary of school highlights>",
  "confidence_score": <0-100 number based on data availability>
}

Return ONLY the JSON object, nothing else.`;

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
            content: 'You are a data extraction assistant. Extract school information and return only valid JSON. Be concise and accurate.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        console.error('⚠️ Rate limit exceeded');
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded', enrichedData: null }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        console.error('⚠️ Payment required');
        return new Response(
          JSON.stringify({ error: 'Payment required', enrichedData: null }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content from AI');
    }

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```\n?/g, '');
    }

    const enrichedData: EnrichedData = JSON.parse(jsonStr);
    console.log('✅ Successfully enriched data with confidence:', enrichedData.confidence_score);

    return new Response(
      JSON.stringify({ enrichedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Enrichment error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        enrichedData: null
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
