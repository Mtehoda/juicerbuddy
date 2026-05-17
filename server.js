import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import messagesHandler from "./api/messages.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.post("/api/messages", messagesHandler);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
