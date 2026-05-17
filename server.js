import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const client = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
})

app.post('/api/messages', async (req, res) => {
  try {
    const { messages, system, max_tokens } = req.body
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: max_tokens || 1000,
      system,
      messages,
    })
    res.json(response)
  } catch (err) {
    console.error('Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('Proxy running on http://localhost:3001'))