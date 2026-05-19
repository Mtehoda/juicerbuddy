import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages, system, max_tokens } = req.body
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: max_tokens || 1000,
      system,
      messages,
    })
    res.json(response)
  } catch (err) {
    console.error('Error:', err.message)
    res.status(500).json({ error: err.message })
  }
}