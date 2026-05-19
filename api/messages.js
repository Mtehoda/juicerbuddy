import Anthropic from '@anthropic-ai/sdk'

const setCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY environment variable.' })
  }

  const client = new Anthropic({ apiKey })

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