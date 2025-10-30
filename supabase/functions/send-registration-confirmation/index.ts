import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import QRCode from "npm:qrcode@1.5.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  registration_id: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { registration_id }: RequestBody = await req.json();

    if (!registration_id) {
      throw new Error("registration_id is required");
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch registration with event details
    const { data: registration, error: fetchError } = await supabase
      .from("registrations")
      .select(`
        *,
        events (
          id,
          title,
          start_at,
          end_at,
          event_type,
          venues:venue_id (
            name,
            address,
            city,
            state,
            zip_code
          )
        )
      `)
      .eq("id", registration_id)
      .single();

    if (fetchError || !registration) {
      throw new Error("Registration not found");
    }

    // Generate QR code as data URL
    const customDomain = Deno.env.get("CUSTOM_DOMAIN") || "https://expo.collegeexpoapp.org";
    const qrCodeUrl = `${customDomain}/check-in/${registration.qr_code}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // Convert data URL to blob
    const base64Data = qrCodeDataUrl.split(",")[1];
    const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // Upload QR code to storage
    const qrFileName = `${registration.event_id}/${registration_id}.png`;
    const { error: uploadError } = await supabase.storage
      .from("qr-codes")
      .upload(qrFileName, binaryData, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    // Get public URL for QR code
    const { data: urlData } = supabase.storage
      .from("qr-codes")
      .getPublicUrl(qrFileName);

    const qrCodeImageUrl = urlData.publicUrl;

    // Update registration with QR code image URL
    await supabase
      .from("registrations")
      .update({
        qr_code_image_url: qrCodeImageUrl,
        confirmation_sent_at: new Date().toISOString(),
      })
      .eq("id", registration_id);

    // Initialize Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Format event date
    const eventDate = new Date(registration.events.start_at).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const eventTime = new Date(registration.events.start_at).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const venue = registration.events.venues;
    const venueInfo = venue
      ? `${venue.name}\n${venue.address}\n${venue.city}, ${venue.state} ${venue.zip_code}`
      : "Virtual Event";

    // Send confirmation email
    const { error: emailError } = await resend.emails.send({
      from: "Houston Black College Expo <onboarding@resend.dev>",
      to: [registration.email],
      subject: `🎓 You're Registered for ${registration.events.title}!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .qr-code { text-align: center; margin: 30px 0; padding: 20px; background: white; border-radius: 8px; }
              .qr-code img { max-width: 300px; height: auto; }
              .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .checklist { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .checklist li { margin: 10px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
              .button { display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎓 Registration Confirmed!</h1>
                <p>You're all set for ${registration.events.title}</p>
              </div>
              
              <div class="content">
                <p>Hi ${registration.first_name},</p>
                <p>Great news! Your registration is confirmed. We're excited to see you at the event!</p>
                
                <div class="qr-code">
                  <img src="${qrCodeImageUrl}" alt="Your QR Code" />
                  <p><strong>Confirmation:</strong> #${registration.qr_code.slice(0, 8).toUpperCase()}</p>
                </div>
                
                <div class="details">
                  <h3>📅 Event Details</h3>
                  <p><strong>Date:</strong> ${eventDate}</p>
                  <p><strong>Time:</strong> ${eventTime}</p>
                  <p><strong>Location:</strong></p>
                  <p style="white-space: pre-line;">${venueInfo}</p>
                </div>
                
                <div class="checklist">
                  <h3>✅ What to Bring</h3>
                  <ul>
                    <li>This QR code (digital or printed)</li>
                    <li>Valid student ID (if applicable)</li>
                    <li>Questions for college representatives</li>
                    <li>Resume copies (optional but recommended)</li>
                    <li>Pen and paper for notes</li>
                  </ul>
                </div>
                
                <div style="text-align: center;">
                  <a href="${qrCodeImageUrl}" class="button" download>Download QR Code</a>
                  <a href="${customDomain}/guest/college-expo" class="button">View Event Details</a>
                </div>
                
                <div class="footer">
                  <p>See you at the expo!</p>
                  <p><strong>The Houston Black College Expo Team</strong></p>
                  <p style="margin-top: 20px;">Questions? Reply to this email or contact us at support@blackcollegeexpo.com</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (emailError) {
      console.error("Email error:", emailError);
      throw emailError;
    }

    console.log("Registration confirmation sent successfully:", registration_id);

    return new Response(
      JSON.stringify({
        success: true,
        qr_code_url: qrCodeImageUrl,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-registration-confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
