# 🚀 Flashcards Backend API

Translation service backend for Flashcards app built with Express.js and deployed on Render.com

## Features

- ✅ **Cache-first approach** - 80+ words preloaded for instant response (<1ms)
- ✅ **Google Translate fallback** - Translates new words on-the-fly
- ✅ **Always-on** - Render free tier keeps service running (no cold start)
- ✅ **CORS enabled** - Works with Vercel frontend
- ✅ **Health checks** - Built-in `/health` endpoint
- ✅ **Structured logging** - Complete request/response tracking
- ✅ **TypeScript** - Full type safety

## Quick Start

### Local Development

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:3001`

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### `GET /health`
Health check endpoint for monitoring

```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-09-08T12:00:00.000Z",
  "uptime": 1234.56
}
```

### `POST /api/translate`
Translate English text to Portuguese

```bash
curl -X POST http://localhost:3001/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"hello"}'
```

Response:
```json
{
  "translation": "olá",
  "source": "en",
  "target": "pt",
  "provider": "Cache",
  "cached": true
}
```

## Environment Variables

```
PORT=3001                           # Server port
NODE_ENV=production|development     # Environment
FRONTEND_URL=https://example.com   # CORS frontend URL (optional)
```

## Deployment on Render

### Automatic Deploy

1. Go to https://render.com
2. Connect GitHub repository
3. Create new Web Service
4. Select this repository
5. Set Build Command: `cd backend && npm install && npm run build`
6. Set Start Command: `cd backend && npm start`
7. Deploy!

The service will be available at `https://flashcards-api-xxxx.onrender.com`

### Manual Deploy

```bash
# Build and run locally
npm run build
npm start

# Push to Render
git push render main
```

## Performance

| Scenario | Response Time | Status |
|----------|---------------|--------|
| Cached word (80+) | <1ms | ✅ Instant |
| New word first time | ~1-2s | ✅ Fast |
| New word (cached) | <1ms | ✅ Instant |

## Updating Frontend URL

Update the CORS origins in `backend/src/server.ts`:

```typescript
origin: [
  "http://localhost:3000",
  "https://your-vercel-url.vercel.app",
  "https://your-custom-domain.com"
]
```

Then rebuild and redeploy.

## Monitoring

Check health status regularly:

```bash
curl https://flashcards-api-xxxx.onrender.com/health
```

Or set up uptime monitoring with services like:
- Render's built-in health checks
- UptimeRobot
- Pingdom
- EasyCron

## Troubleshooting

### Connection refused
- Check if server is running
- Verify PORT is correct
- Check firewall settings

### CORS errors
- Ensure frontend URL is in CORS whitelist
- Check headers in request

### Translation not working
- Verify Google Translate API is accessible
- Check internet connection
- Try a different word

## Architecture

```
backend/
├── src/
│   ├── server.ts           # Express app & routes
│   ├── logger.ts           # Logging system
│   ├── translateService.ts # Translation logic
│   └── preloadedTranslations.ts # 80+ cached words
├── dist/                   # Compiled JavaScript
├── package.json
├── tsconfig.json
├── Dockerfile              # Docker configuration
└── .gitignore
```

## Dependencies

- **express** - Web framework
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **typescript** - Type safety
- **tsx** - TypeScript executor

## License

MIT

---

**Deployed URL**: Will be provided after first deployment to Render
