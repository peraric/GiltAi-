export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { messages = [] } = req.body || {};
  if (!Array.isArray(messages)) return res.status(400).json({ error: 'messages must be an array' });

  // Provider-agnostic GiltAi engine boundary. No Claude/OpenAI key is required for the UI prototype.
  // A real provider can be attached later through server-side environment variables only.
  const last = messages.filter(m => m && m.role === 'user').at(-1)?.content || '';
  return res.status(200).json({
    id: `giltai_${Date.now()}`,
    model: 'giltai-core',
    message: {
      role: 'assistant',
      content: `GiltAi received: “${String(last).slice(0, 500)}”\n\nThe GiltAi engine boundary is live. The next step is attaching a model provider securely on the server.`
    }
  });
}
