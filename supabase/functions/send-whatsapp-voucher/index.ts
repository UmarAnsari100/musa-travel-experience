// Supabase Edge Function: send-whatsapp-voucher
// Dispatches Meta WhatsApp Cloud API messages server-side
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { recipientPhone, customerName, bookingReference, voucherUrl, messageText } = await req.json();

    const phoneNumberId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
    const accessToken = Deno.env.get("WHATSAPP_ACCESS_TOKEN");

    if (!phoneNumberId || !accessToken) {
      throw new Error("Missing Meta WhatsApp Cloud API credentials in Edge Function environment variables.");
    }

    // Clean phone number (must be digits only with country code)
    const cleanPhone = recipientPhone.replace(/[^0-9]/g, "");

    // 1. Send Text / Template Message
    const metaApiUrl = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanPhone,
      type: "text",
      text: {
        preview_url: true,
        body: messageText,
      },
    };

    const res = await fetch(metaApiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Meta Graph API error:", result);
      throw new Error(result.error?.message || "Failed to dispatch WhatsApp message via Meta Cloud API");
    }

    const messageId = result.messages?.[0]?.id || "msg-" + Date.now();

    // 2. If voucher PDF URL is present, send document attachment
    if (voucherUrl) {
      try {
        await fetch(metaApiUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: cleanPhone,
            type: "document",
            document: {
              link: voucherUrl,
              caption: `MUSA TRANSPORT Official Voucher - Ref: ${bookingReference}`,
              filename: `MUSA-Voucher-${bookingReference}.pdf`,
            },
          }),
        });
      } catch (docErr) {
        console.warn("Voucher attachment dispatch warning:", docErr);
      }
    }

    return new Response(JSON.stringify({ success: true, messageId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
