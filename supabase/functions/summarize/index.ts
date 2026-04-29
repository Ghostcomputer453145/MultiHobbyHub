import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const { title, content, upvotes } = await req.json();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Summarize posts clearly and briefly.",
        },
        {
          role: "user",
          content: `Title: ${title}\nContent: ${content}\nUpvotes: ${upvotes}`,
        },
      ],
    }),
  });

  const data = await response.json();

  return new Response(
    JSON.stringify({
      summary: data.choices?.[0]?.message?.content || "No summary",
    }),
    { headers: { "Content-Type": "application/json" } }
  );
});