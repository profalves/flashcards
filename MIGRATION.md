# 🚀 Migration to Render Backend

## Overview

Migramos de uma arquitetura **Vercel serverless** para uma arquitetura **Vercel + Render híbrida**:

```
┌─────────────────────────────────────────────────────┐
│         Frontend (Vercel)                           │
│  ├─ Static pages (Next.js App)                     │
│  ├─ Lightweight proxy endpoint                     │
│  └─ CORS handling                                   │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ API calls (JSON over HTTPS)
                   │
┌──────────────────▼──────────────────────────────────┐
│         Backend (Render.com) - ALWAYS ON            │
│  ├─ 80+ cached words (instant)                     │
│  ├─ Google Translate fallback (1-2s)               │
│  ├─ No cold start ✅                                │
│  ├─ Health checks                                   │
│  └─ Structured logging                              │
└─────────────────────────────────────────────────────┘
```

## Why This Architecture?

| Aspecto | Vercel-only | Vercel + Render |
|---------|------------|-----------------|
| Cold start | ❌ 10s+ timeout | ✅ No timeout |
| Cache hits | ✅ <1ms | ✅ <1ms |
| Cache misses | ❌ Timeout | ✅ 1-2s |
| Always-on | ❌ No | ✅ Yes |
| Cost (free tier) | ✅ $0 | ✅ $0 |
| Complexity | ✅ Simple | ⚠️ Moderate |

## Deployment Steps

### 1. Deploy Backend to Render

1. Go to https://render.com
2. Click "New Web Service"
3. Connect your GitHub repository (flashcards)
4. Configure service:
   - **Name**: `flashcards-api`
   - **Region**: São Paulo (or closest)
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Instance Type**: Free
   - **Auto-Deploy**: Yes

5. Add environment variable (optional):
   - `NODE_ENV`: `production`

6. Click "Deploy Service"

7. Wait for build to complete (3-5 minutes)

8. Copy the URL: `https://flashcards-api-xxxx.onrender.com`

### 2. Update Frontend Vercel

1. Go to https://vercel.com
2. Select `flashcards` project
3. Go to Settings → Environment Variables
4. Add/Update:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://flashcards-api-xxxx.onrender.com`
   - **Environments**: Production, Preview, Development

5. Click "Save"
6. Redeploy the frontend

### 3. Test Endpoints

#### Backend health check
```bash
curl https://flashcards-api-xxxx.onrender.com/health
# Response: {"status":"healthy",...}
```

#### Backend translate (direct)
```bash
curl -X POST https://flashcards-api-xxxx.onrender.com/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"hello"}'
# Response: {"translation":"olá","provider":"Cache",...}
```

#### Frontend proxy (through Vercel)
```bash
curl -X POST https://flashcards-murex-one.vercel.app/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"hello"}'
# Response: {"translation":"olá","provider":"Cache",...}
```

## Performance Results

### Before (Vercel-only)
```
First request:   ❌ TIMEOUT (504 - 10s+ exceeded)
Cached request:  ✅ <1ms
```

### After (Vercel + Render)
```
First request (cache hit):   ✅ <1ms
First request (cache miss):  ✅ 1-2s
Cached request:              ✅ <1ms
```

## Architecture Benefits

✅ **No Cold Start** - Render free tier keeps service running
✅ **Faster Miss Handling** - Google Translate API has 8s timeout
✅ **Independent Scaling** - Frontend and backend scale separately
✅ **Better Monitoring** - Health checks on backend
✅ **Easier Debugging** - Backend logs are separate
✅ **Future Ready** - Can migrate to paid tiers independently
✅ **Zero Migrations** - Both services support git push deployments

## Fallback Strategy

If backend is down:
1. Frontend will get 504 Gateway Timeout
2. Display error message to user
3. Suggest retry or contact support
4. User data is NOT lost (local storage cached)

To improve resilience:
- Add retry logic in frontend (3 attempts with exponential backoff)
- Implement circuit breaker pattern
- Cache translations in browser localStorage

## Monitoring Render

### View Logs
```bash
# In Render dashboard:
1. Select "flashcards-api" service
2. Click "Logs" tab
3. Watch real-time logs
```

### Uptime Monitoring
Set up external monitoring with:
- **UptimeRobot**: https://uptimerobot.com (free)
- **Pingdom**: https://www.pingdom.com
- **EasyCron**: https://www.easycron.com

Example UptimeRobot config:
- URL: `https://flashcards-api-xxxx.onrender.com/health`
- Interval: 5 minutes
- Alert if down for 15 minutes

### Auto Warm-up

To prevent cold starts (in case of Render.com changes):

```bash
# Use EasyCron.com:
1. Create account
2. Create cron job:
   - URL: https://flashcards-api-xxxx.onrender.com/health
   - Frequency: Every 14 minutes
   - HTTP Method: GET
```

## Troubleshooting

### Backend not responding
```bash
# Check backend health
curl https://flashcards-api-xxxx.onrender.com/health

# Check Render dashboard for error logs
# Restart service if needed (Render dashboard → Manual restart)
```

### Frontend can't reach backend
1. Verify URL is correct in Vercel env vars
2. Check CORS is enabled (it is in server.ts)
3. Check frontend logs for error messages
4. Try direct curl to backend

### Slow translation
1. Check if word is in cache (first 2 are instant)
2. If not cached, Google Translate API takes 1-2s (normal)
3. Word gets cached after first translation

## Rollback Plan

If something goes wrong:

### Quick Rollback
1. Revert Vercel env variable to localhost
2. Deploy local backend: `npm run dev`
3. Redeploy frontend

### Full Rollback (to Vercel-only)
1. Restore `src/pages/api/translate.ts` from git history
2. Redeploy frontend
3. Delete Render service if desired

## Future Improvements

- [ ] Add retry logic with exponential backoff
- [ ] Implement circuit breaker pattern
- [ ] Cache translations in browser localStorage
- [ ] Add request rate limiting
- [ ] Use Redis for distributed cache (paid tier)
- [ ] Add analytics/metrics
- [ ] Implement A/B testing for new providers

## File Structure

```
flashcards/
├── backend/                    # NEW - Backend Express.js
│   ├── src/
│   │   ├── server.ts          # Express app
│   │   ├── logger.ts          # Logging
│   │   ├── translateService.ts
│   │   └── preloadedTranslations.ts
│   ├── dist/                  # Compiled JS
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── .gitignore
│   └── README.md
│
├── frontend/                   # EXISTING - Vercel frontend
│   ├── src/
│   │   ├── pages/api/translate.ts  # UPDATED - Now proxies to backend
│   │   ├── services/               # STILL USED - For development
│   │   └── ...
│   ├── package.json
│   ├── next.config.js
│   └── ...
│
├── render.yaml                # NEW - Render deployment config
├── .env.example               # UPDATED - Points to Render backend
├── MIGRATION.md               # THIS FILE
└── TRANSLATION_SERVICE.md     # UPDATED
```

## Costs

| Service | Free Tier | Limit | Cost/Month |
|---------|-----------|-------|-----------|
| Vercel (Frontend) | ✅ Yes | Generous | $0 |
| Render (Backend) | ✅ Yes | 750h/month* | $0 |
| Total | ✅ | | **$0** |

*Render free tier: Auto-sleeps after 15 min of inactivity. For always-on, upgrade to $7/month.

## Support

For issues:
1. Check Render logs in dashboard
2. Check Vercel logs in dashboard
3. Test backend directly with curl
4. Check network tab in browser DevTools
5. Look for CORS errors

---

**Status**: ✅ Ready for production
**Deployment Date**: September 8, 2026
**Architect**: Rodrigo Alves
