const TELEGRAM_API_URL = "https://api.telegram.org";

const BOT_TOKEN = "8389822366:AAHHHMaQ5sLLYbOcylulAHWENKOfzqsNgmc";
const MAIN_CHAT_ID = "3555771475";

const ALLOWED_METHODS = ["sendMessage", "deleteMessage"];

export default async (req, context) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { method, body } = await req.json();

    if (!method || typeof method !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid method parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!ALLOWED_METHODS.includes(method)) {
      return new Response(
        JSON.stringify({
          error: `Method not allowed. Allowed methods: ${ALLOWED_METHODS.join(", ")}`
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const finalBody = {
      ...body,
      chat_id: body.chat_id || MAIN_CHAT_ID
    };

    const telegramUrl = `${TELEGRAM_API_URL}/bot${BOT_TOKEN}/${method}`;

    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalBody),
    });

    const responseData = await response.json();

    return new Response(JSON.stringify(responseData), {
      status: response.ok ? 200 : response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error) {
    console.error("Telegram proxy error:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
