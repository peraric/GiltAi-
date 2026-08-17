import http from 'node:http';

const PORT = process.env.PORT || 8787;

function json(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json', 'access-control-allow-origin': '*' });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,POST,OPTIONS', 'access-control-allow-headers': 'content-type,authorization' });
    return res.end();
  }

  if (req.method === 'GET' && req.url === '/health') {
    return json(res, 200, { ok: true, service: 'giltai' });
  }

  if (req.method === 'POST' && req.url === '/v1/chat') {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try {
        const body = JSON.parse(raw || '{}');
        const message = String(body.message || '').trim();
        if (!message) return json(res, 400, { error: 'message is required' });

        // Provider-agnostic boundary. Replace this function with the selected AI model provider.
        return json(res, 200, {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: `GiltAi received: ${message}`,
          model: 'giltai-core'
        });
      } catch {
        return json(res, 400, { error: 'invalid JSON' });
      }
    });
    return;
  }

  json(res, 404, { error: 'not_found' });
});

server.listen(PORT, () => console.log(`GiltAi API listening on ${PORT}`));
