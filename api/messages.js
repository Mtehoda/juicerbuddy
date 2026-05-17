import Anthropic from "@anthropic-ai/sdk";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { messages, system, max_tokens } = req.body;

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await client.messages.create({
      model: "claude-4-6-sonnet-latest",
      max_tokens: max_tokens || 1000,
      system,
      messages,
    });

    res.status(200).json(response);
  } catch (err) {
    console.error("Serverless Error:", err);
    res.status(500).json({ error: err.message });
  }
}
