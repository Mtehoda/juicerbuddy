import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY environment variable.' })
  }

  const client = new Anthropic({ apiKey })
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