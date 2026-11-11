import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import fs from 'node:fs'

// Fait fonctionner les fonctions serverless Vercel (api/**/*.js) en local avec
// `npm run dev` — Vite seul ne sait servir que des fichiers statiques/JS côté
// client, il ignore totalement le dossier api/. En production (Vercel), ce
// plugin n'intervient jamais : Vercel exécute ces mêmes fichiers nativement.
function apiDevMiddleware(env) {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlPath = req.url.split('?')[0]
        if (!urlPath.startsWith('/api/') || req.method !== 'POST') return next()

        const filePath = path.join(__dirname, urlPath + '.js')
        if (!fs.existsSync(filePath)) return next()

        try {
          // Les handlers lisent process.env (comme sur Vercel) — on y recopie
          // les variables du .env, que Vite ne charge normalement que dans
          // import.meta.env côté client.
          Object.assign(process.env, env)

          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const raw = Buffer.concat(chunks).toString('utf-8')
          req.body = raw ? JSON.parse(raw) : {}

          res.status = (code) => {
            res.statusCode = code
            return res
          }
          res.json = (payload) => {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(payload))
          }

          const mod = await import(`${filePath}?t=${Date.now()}`)
          await mod.default(req, res)
        } catch (err) {
          console.error('[api-dev-middleware]', urlPath, err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: 'Erreur serveur locale (voir le terminal).' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), apiDevMiddleware(env)],
    server: {
      historyApiFallback: true,
    },
  }
})
