import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function mockServerPlugin(): Plugin {
  const clients = new Set<any>()
  const mockStore: any[] = []

  return {
    name: 'mock-feedback-api-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const parsedUrl = new URL(req.url || '/', 'http://localhost')

        // 1. OPTIONS preflight
        if (req.method === 'OPTIONS' && parsedUrl.pathname.startsWith('/api/')) {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          })
          res.end()
          return
        }

        // 2. SSE Stream: GET /api/stream
        if (parsedUrl.pathname === '/api/stream') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          })
          res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE Stream Active' })}\n\n`)
          clients.add(res)

          req.on('close', () => {
            clients.delete(res)
          })
          return
        }

        // 3. GET /api/feedbacks
        if (req.method === 'GET' && parsedUrl.pathname === '/api/feedbacks') {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          })
          res.end(JSON.stringify({ success: true, count: mockStore.length, items: mockStore }))
          return
        }

        // 4. POST /api/feedback
        if (req.method === 'POST' && parsedUrl.pathname === '/api/feedback') {
          let body = ''
          req.on('data', chunk => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}')
              const text = data.text || data.content || data.message || data.comment || data.question
              if (!text) {
                res.writeHead(400, {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                })
                res.end(JSON.stringify({ error: 'Missing "text" field in JSON body' }))
                return
              }

              const newEntry = {
                id: `fb-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
                text,
                author: data.author || 'curl_guest',
                source: data.source || 'curl',
                timestamp: new Date().toLocaleTimeString(),
                createdAt: new Date().toISOString(),
              }

              mockStore.unshift(newEntry)
              if (mockStore.length > 50) mockStore.pop()

              // Broadcast to all connected SSE clients
              const ssePayload = `data: ${JSON.stringify({ type: 'NEW_FEEDBACK', item: newEntry })}\n\n`
              clients.forEach(client => {
                try {
                  client.write(ssePayload)
                } catch {
                  clients.delete(client)
                }
              })

              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              })
              res.end(JSON.stringify({ success: true, item: newEntry }))
            } catch (err: any) {
              res.writeHead(400, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              })
              res.end(JSON.stringify({ error: 'Malformed JSON payload: ' + err.message }))
            }
          })
          return
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockServerPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
