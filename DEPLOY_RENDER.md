# 🚀 Deploy Render - Guia Rápido

## Em 5 Minutos

### Passo 1: Criar conta Render (1 min)
1. Acesse https://render.com
2. Clique "Sign Up"
3. Use GitHub ou email
4. Confirme email

### Passo 2: Deploy Backend (3 min)
1. No Render dashboard, clique "+ New"
2. Selecione "Web Service"
3. Conecte seu GitHub (`profalves/flashcards`)
4. Preencha:
   - **Name**: `flashcards-api`
   - **Region**: São Paulo (ou mais próxima)
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Instance Type**: Free
   - **Auto-Deploy**: Yes (deixar ligado)

5. Clique "Deploy"
6. Aguarde 3-5 minutos... ☕

### Passo 3: Copiar URL Backend
1. No dashboard Render, após deploy terminar
2. Copie a URL (será algo como: `https://flashcards-api-xxxx.onrender.com`)

### Passo 4: Atualizar Vercel
1. Acesse https://vercel.com
2. Selecione projeto `flashcards`
3. Vá em Settings → Environment Variables
4. Procure por `NEXT_PUBLIC_API_URL`
5. Atualize com URL do Render: `https://flashcards-api-xxxx.onrender.com`
6. Clique "Save"
7. Vercel vai fazer redeploy automaticamente

### Passo 5: Testar
```bash
# Terminal 1: Ver logs do backend
curl https://flashcards-api-xxxx.onrender.com/health

# Terminal 2: Testar tradução
curl -X POST https://flashcards-api-xxxx.onrender.com/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"hello"}'
```

Expected response:
```json
{
  "translation": "olá",
  "source": "en",
  "target": "pt",
  "provider": "Cache",
  "cached": true
}
```

## ✅ Pronto!

Seu backend está rodando em Render com:
- ✅ Zero cold start
- ✅ 80+ palavras em cache
- ✅ Google Translate fallback
- ✅ Sempre-on (750h/mês grátis)

## URLs Finais

| Serviço | URL |
|---------|-----|
| Frontend | https://flashcards-murex-one.vercel.app |
| Backend API | https://flashcards-api-xxxx.onrender.com |
| Health Check | https://flashcards-api-xxxx.onrender.com/health |

## Troubleshooting Rápido

### Backend demorando para fazer deploy?
- Render pode levar 3-5 minutos na primeira vez
- Vá em "Events" para ver progresso
- Veja os logs em "Logs" tab

### Erro de CORS?
- Verifique `NEXT_PUBLIC_API_URL` está correto em Vercel
- Redeploye o Vercel

### Tradução retorna vazio?
- Teste com uma palavra do cache: "hello", "goodbye", "please"
- Verifique logs do Render: Dashboard → flashcards-api → Logs

### Backend foi para "sleep"?
- Render free tier hiberna após 15 min de inatividade
- Para sempre-on: upgrade para $7/mês
- OU configure warm-up automático (veja MIGRATION.md)

---

**Precisa de ajuda?** Veja arquivo `MIGRATION.md` para guia completo
