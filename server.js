import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// IMPORTANT: Backend MUST use ANTHROPIC_API_KEY, not VITE_...
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// IMPORTANT: Match your frontend route EXACTLY
app.post('/api/v1/messages', async (req, res) => {
  try {
    const { messages, system, max_tokens } = req.body

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: max_tokens || 1000,
      system,
      messages,
    })

    res.json(response)
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('Proxy running on http://localhost:3001'))
