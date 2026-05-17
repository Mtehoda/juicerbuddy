import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
});

app.post("/api/v1/messages", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await client.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 300,
      messages,
    });

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
