import { serve } from "https://deno.land/std/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    let body;
    try {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    } catch (e) {
      return new Response(
        JSON.stringify({
          error: "Invalid or missing JSON body",
          detail: e.message,
        }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const { title, content, upvotes } = body;

    const apiKey = Deno.env.get("FAU_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing FAU_API_KEY secret" }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    const response = await fetch(
      "https://fauengtrussed.fau.edu/provider/generic/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-5.4",
          messages: [
            {
              role: "system",
              content: `Summarize like Reddit TL;DR cards:
- 2 short sentences max
- Highlight key idea
- Make it engaging
- No fluff`,
            },
            {
              role: "user",
              content: `Title: ${title}\nContent: ${content}\nUpvotes: ${upvotes}`,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: data?.error || "FAU API request failed",
        }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    return new Response(
      JSON.stringify({
        summary: data.choices?.[0]?.message?.content || "No summary",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
});