// Supabase Edge Function: whatsapp-webhook
// Receives real Meta delivery status receipts (sent, delivered, read, failed)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

serve(async (req) => {
  const url = new URL(req.url);

  // 1. Meta Webhook Verification (GET request)
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const expectedToken = Deno.env.get("WHATSAPP_WEBHOOK_VERIFY_TOKEN") || "musa_transport_verify_2026";

    if (mode === "subscribe" && token === expectedToken) {
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  // 2. Process Delivery Receipts (POST request)
  if (req.method === "POST") {
    try {
      const body = await req.json();

      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, serviceRoleKey);

      const entry = body.entry?.[0];
      const change = entry?.changes?.[0];
      const value = change?.value;
      const statuses = value?.statuses;

      if (statuses && statuses.length > 0) {
        for (const st of statuses) {
          const metaMsgId = st.id;
          const status = st.status; // 'sent', 'delivered', 'read', 'failed'
          const timestamp = new Date(parseInt(st.timestamp) * 1000).toISOString();

          const updatePayload: Record<string, any> = {
            status,
          };

          if (status === "delivered") updatePayload.delivered_at = timestamp;
          if (status === "read") updatePayload.read_at = timestamp;
          if (status === "failed") {
            updatePayload.error_message = st.errors?.[0]?.message || "Delivery failed";
          }

          // Update whatsapp_messages table
          await supabase
            .from("whatsapp_messages")
            .update(updatePayload)
            .eq("meta_message_id", metaMsgId);
        }
      }

      return new Response("EVENT_RECEIVED", { status: 200 });
    } catch (err: any) {
      console.error("Webhook processing error:", err);
      return new Response("Internal Error", { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});
