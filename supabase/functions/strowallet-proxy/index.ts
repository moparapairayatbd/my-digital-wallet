import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const STROWALLET_BASE = "https://strowallet.com/api/bitvcard";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const strowalletKey = Deno.env.get("STROWALLET_PUBLIC_KEY");

    if (!strowalletKey) {
      return new Response(JSON.stringify({ error: "Strowallet API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Strowallet API Key info:", {
      length: strowalletKey.length,
      prefix: strowalletKey.substring(0, 6),
      suffix: strowalletKey.substring(strowalletKey.length - 4),
    });

    // Verify user
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, ...params } = body;

    let endpoint = "";
    const formData: Record<string, string> = { public_key: strowalletKey };

    switch (action) {
      case "create-customer": {
        endpoint = `${STROWALLET_BASE}/create-user/`;
        formData.firstName = params.firstName;
        formData.lastName = params.lastName;
        formData.customerEmail = params.email;
        formData.phoneNumber = params.phone;
        formData.dateOfBirth = params.dateOfBirth || "1990-01-01";
        formData.idNumber = params.idNumber || "0000000000";
        formData.idType = params.idType || "NID";
        formData.address = params.address || "Dhaka";
        formData.city = params.city || "Dhaka";
        formData.state = params.state || "Dhaka";
        formData.country = params.country || "BD";
        formData.zipCode = params.zipCode || "1000";
        formData.line1 = params.line1 || params.address || "Dhaka";
        break;
      }
      case "create-card": {
        endpoint = `${STROWALLET_BASE}/create-card/`;
        formData.name_on_card = params.name_on_card;
        formData.card_type = params.card_type || "visa";
        formData.amount = String(params.amount || 1);
        formData.customerEmail = params.customerEmail;
        break;
      }
      case "fund-card": {
        endpoint = `${STROWALLET_BASE}/fund-card/`;
        formData.card_id = params.card_id;
        formData.amount = String(params.amount);
        break;
      }
      case "fetch-card-detail": {
        endpoint = `${STROWALLET_BASE}/fetch-card-detail/`;
        formData.card_id = params.card_id;
        break;
      }
      case "freeze-card": {
        endpoint = `${STROWALLET_BASE}/${params.freeze_action === "unfreeze" ? "unfreeze-card" : "freeze-card"}/`;
        formData.card_id = params.card_id;
        break;
      }
      case "card-transactions": {
        endpoint = `${STROWALLET_BASE}/card-transactions/`;
        formData.card_id = params.card_id;
        break;
      }
      case "withdraw-from-card": {
        endpoint = `${STROWALLET_BASE}/withdraw-from-card/`;
        formData.card_id = params.card_id;
        formData.amount = String(params.amount);
        break;
      }
      case "block-card": {
        if (!params.card_id) {
          return new Response(JSON.stringify({ error: "card_id is required to block a card" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        // Strowallet block-card uses GET with query params (POST returns 405)
        const blockUrl = new URL(`${STROWALLET_BASE}/block-card/`);
        blockUrl.searchParams.set("public_key", strowalletKey);
        blockUrl.searchParams.set("card_id", params.card_id);
        console.log(`Strowallet proxy: block-card (GET) -> ${blockUrl.toString()}`);
        const blockRes = await fetch(blockUrl.toString(), { method: "GET" });
        const blockContentType = blockRes.headers.get("content-type") || "";
        const blockRawText = await blockRes.text();
        console.log(`Strowallet block-card response (${blockRes.status}):`, blockRawText.substring(0, 500));
        if (!blockContentType.includes("application/json")) {
          console.error("Strowallet block-card returned non-JSON:", blockContentType, blockRawText.substring(0, 300));
          return new Response(JSON.stringify({
            error: `block-card endpoint returned non-JSON (status ${blockRes.status}). The endpoint may not be supported on your plan.`,
            status_code: blockRes.status,
          }), {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const blockData = JSON.parse(blockRawText);
        return new Response(JSON.stringify(blockData), {
          status: blockRes.ok ? 200 : 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      case "card-withdraw-status": {
        endpoint = `${STROWALLET_BASE}/getcard_withdrawstatus/`;
        formData.card_id = params.card_id;
        break;
      }
      default:
        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    // Build form-encoded body
    const urlParams = new URLSearchParams(formData);

    console.log(`Strowallet proxy: ${action} -> ${endpoint}`);

    const apiRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: urlParams.toString(),
    });

    const contentType = apiRes.headers.get("content-type") || "";
    const rawText = await apiRes.text();

    console.log(`Strowallet raw response for ${action} (status ${apiRes.status}):`, rawText.substring(0, 500));

    if (!contentType.includes("application/json")) {
      console.error("Strowallet returned non-JSON:", contentType, rawText.substring(0, 300));
      return new Response(JSON.stringify({ 
        error: `Strowallet API returned non-JSON response (status ${apiRes.status}). This may indicate an invalid API key, wrong endpoint, or server issue.`,
        status_code: apiRes.status,
      }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiData = JSON.parse(rawText);
    console.log(`Strowallet response for ${action}:`, JSON.stringify(apiData));

    return new Response(JSON.stringify(apiData), {
      status: apiRes.ok ? 200 : 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Strowallet proxy error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
