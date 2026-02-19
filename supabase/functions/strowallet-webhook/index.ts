import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/**
 * Verify HMAC-SHA256 signature from Strowallet.
 * Strowallet sends the signature in the "x-strowallet-signature" header
 * as a hex-encoded HMAC-SHA256 of the raw request body using the shared secret.
 */
async function verifySignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): Promise<boolean> {
  if (!signatureHeader) return false;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(rawBody);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const expectedHex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison to prevent timing attacks
  if (expectedHex.length !== signatureHeader.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expectedHex.length; i++) {
    mismatch |= expectedHex.charCodeAt(i) ^ signatureHeader.charCodeAt(i);
  }
  return mismatch === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const webhookSecret = Deno.env.get("STROWALLET_WEBHOOK_SECRET");
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Read raw body first (needed for signature verification)
    const rawBody = await req.text();

    // Verify signature if secret is configured
    if (webhookSecret) {
      const signature = req.headers.get("x-strowallet-signature");
      const isValid = await verifySignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.warn("Webhook signature verification failed. Signature:", signature);
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.log("Webhook signature verified successfully.");
    } else {
      console.warn("STROWALLET_WEBHOOK_SECRET not set — skipping signature verification.");
    }

    const payload = JSON.parse(rawBody);
    console.log("Strowallet webhook received:", JSON.stringify(payload).substring(0, 1000));

    // Determine event type from payload keys
    let eventType = "unknown";
    let cardId = "";
    let amount: number | null = null;
    let status = "";
    let narrative = "";
    let reference = "";

    // Authorization request: has "authorization.request" key
    if (payload["authorization.request"]) {
      eventType = "authorization.request";
      cardId = payload.card_Id || payload.cardId || "";
      amount = Number(payload.merchantAmount || payload.amount || 0);
      narrative = payload.merchant?.name || "";
      reference = payload["authorization.request"];
      status = "pending";
    }
    // Transaction created
    else if (payload["transaction.created"]) {
      eventType = "transaction.created";
      cardId = payload.card_Id || payload.cardId || "";
      amount = Number(payload.amount || 0);
      status = payload.status || "success";
      narrative = payload.narrative || "";
      reference = payload["transaction.created"] || payload.reference || "";
    }
    // Transaction refund
    else if (payload["transaction.refund"]) {
      eventType = "transaction.refund";
      cardId = payload.card_Id || payload.cardId || "";
      amount = Number(payload.amount || 0);
      status = payload.status || "refunded";
      narrative = payload.narrative || "";
      reference = payload["transaction.refund"] || payload.reference || "";
    }
    // Virtual card transaction events
    else if (payload.event) {
      eventType = payload.event; // e.g. virtualcard.transaction.crossborder, virtualcard.transaction.declined
      cardId = payload.cardId || payload.card_Id || "";
      amount = Number(payload.amount || payload.chargedAmount || 0);
      status = payload.status || "";
      narrative = payload.narrative || payload.reason || "";
      reference = payload.reference || payload.id || "";
    }

    // Find user by strowallet_card_id
    let userId: string | null = null;
    if (cardId) {
      const { data: card } = await supabase
        .from("cards")
        .select("user_id")
        .eq("strowallet_card_id", cardId)
        .maybeSingle();
      if (card) userId = card.user_id;
    }

    // Log the webhook event
    await supabase.from("card_webhook_logs").insert({
      event_type: eventType,
      card_id: cardId,
      strowallet_ref: reference,
      amount,
      status,
      narrative,
      raw_payload: payload,
      user_id: userId,
      processed: true,
    });

    // Create notification for the user
    if (userId) {
      let notifTitle = "";
      let notifMessage = "";

      switch (eventType) {
        case "authorization.request":
          notifTitle = "💳 Card Authorization";
          notifMessage = `Authorization request for $${amount} at ${narrative || "a merchant"}`;
          break;
        case "transaction.created":
          notifTitle = "✅ Card Transaction";
          notifMessage = `$${amount} charge ${status === "success" ? "completed" : status} at ${narrative || "merchant"}`;
          break;
        case "transaction.refund":
          notifTitle = "↩️ Card Refund";
          notifMessage = `$${amount} refund processed from ${narrative || "merchant"}`;
          break;
        case "virtualcard.transaction.declined":
          notifTitle = "❌ Card Declined";
          notifMessage = `Transaction declined: ${narrative || "Unknown reason"}`;
          break;
        default:
          if (eventType.includes("crossborder")) {
            notifTitle = "🌍 Cross-border Transaction";
            notifMessage = `$${amount} international charge at ${narrative || "merchant"}`;
          } else {
            notifTitle = "💳 Card Event";
            notifMessage = `Card event: ${eventType} — $${amount || 0}`;
          }
      }

      await supabase.from("notifications").insert({
        user_id: userId,
        type: "transaction",
        title: notifTitle,
        message: notifMessage,
        metadata: { event_type: eventType, card_id: cardId, reference },
      });
    }

    // For authorization requests, respond with approval
    // In production you'd check user balance/limits here
    if (eventType === "authorization.request") {
      // Check if card is frozen or blocked
      let approve = true;
      let declineReason = "";

      if (cardId) {
        const { data: card } = await supabase
          .from("cards")
          .select("status, spending_limit, daily_spent")
          .eq("strowallet_card_id", cardId)
          .maybeSingle();

        if (card) {
          if (card.status === "frozen") {
            approve = false;
            declineReason = "Card is frozen";
          } else if (card.status === "blocked") {
            approve = false;
            declineReason = "Card is blocked";
          } else if (card.spending_limit && amount && (card.daily_spent || 0) + amount > card.spending_limit) {
            approve = false;
            declineReason = "Daily spending limit exceeded";
          }

          // Update daily_spent on approval
          if (approve && amount) {
            await supabase
              .from("cards")
              .update({ daily_spent: (card.daily_spent || 0) + amount })
              .eq("strowallet_card_id", cardId);
          }
        }
      }

      const response = approve
        ? { APPROVE: "YES" }
        : { APPROVE: "NO", reason: declineReason };

      console.log(`Authorization response for ${reference}:`, JSON.stringify(response));

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
