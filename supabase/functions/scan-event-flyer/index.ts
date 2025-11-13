import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { flyer_url, event_id } = await req.json();
    
    if (!flyer_url) {
      return new Response(
        JSON.stringify({ error: 'flyer_url is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not found');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call Lovable AI with vision model to analyze the flyer
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
            content: `You are an event flyer data extraction assistant. Analyze event flyers and extract structured information accurately. Return ONLY valid JSON, no markdown formatting or extra text.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this event flyer and extract the following information in JSON format. If any field is not clearly visible, return null for that field:

{
  "event_title": "string",
  "event_date": "YYYY-MM-DD",
  "start_time": "HH:MM" (24-hour format),
  "end_time": "HH:MM" (24-hour format),
  "venue_name": "string",
  "full_address": "string (complete address line)",
  "city": "string",
  "state": "string (2-letter code)",
  "zip_code": "string"
}

Focus on accuracy - if unsure about any field, leave it as null for manual entry.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: flyer_url
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze flyer' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const extractedText = aiData.choices?.[0]?.message?.content;

    if (!extractedText) {
      return new Response(
        JSON.stringify({ error: 'No data extracted from flyer' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response from AI
    let extractedData;
    try {
      // Remove markdown code blocks if present
      const cleanedText = extractedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      extractedData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', extractedText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to parse extracted data',
          raw_response: extractedText 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate confidence score based on how many fields were extracted
    const totalFields = 9;
    const extractedFields = Object.values(extractedData).filter(v => v !== null).length;
    const confidenceScore = extractedFields / totalFields;

    return new Response(
      JSON.stringify({
        success: true,
        extracted_data: extractedData,
        confidence_score: confidenceScore,
        event_id: event_id
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in scan-event-flyer:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
