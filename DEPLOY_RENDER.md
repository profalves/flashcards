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
   - **Name**: `flashcards` (ou `flashcards-api`)
   - **Region**: Oregon (US West) ou mais próxima
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Instance Type**: Free
   - **Auto-Deploy**: Yes (deixar ligado)

5. Clique "Deploy"
6. Aguarde 3-5 minutos... ☕

### Passo 3: Copiar URL Backend
1. No dashboard Render, após deploy terminar
2. Copie a URL do serviço

**URL de produção atual:**
```
https://flashcards-8x48.onrender.com
```

### Passo 4: Atualizar Vercel
1. Acesse https://vercel.com
2. Selecione projeto `flashcards`
3. Vá em Settings → Environment Variables
4. Procure por `NEXT_PUBLIC_API_URL`
5. Atualize com:
   ```
   https://flashcards-8x48.onrender.com
   ```
6. Clique "Save"
7. Vercel vai fazer redeploy automaticamente

### Passo 5: Testar
```bash
# Health check
curl https://flashcards-8x48.onrender.com/health

# Tradução
curl -X POST https://flashcards-8x48.onrender.com/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"hello"}'
```

Resposta esperada:
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
| Backend API | https://flashcards-8x48.onrender.com |
| Health Check | https://flashcards-8x48.onrender.com/health |
| Translate API | https://flashcards-8x48.onrender.com/api/translate |

## Troubleshooting Rápido

### Erro npm E401 no build?
- Causa comum: `package-lock.json` apontando para registry privado (ex.: Azure DevOps corporativo)
- Solução: regenerar o lockfile com `NPM_CONFIG_REGISTRY=https://registry.npmjs.org npm install`
- Veja `FIX_NPM_E401.md` para detalhes

### Backend demorando para fazer deploy?
- Render pode levar 3-5 minutos na primeira vez
- Vá em "Events" para ver progresso
- Veja os logs em "Logs" tab

### Erro de CORS?
- Verifique `NEXT_PUBLIC_API_URL` está correto em Vercel
- Redeploye o Vercel

### Tradução retorna vazio?
- Teste com uma palavra do cache: "hello", "goodbye", "please"
- Verifique logs do Render: Dashboard → flashcards → Logs

### Backend foi para "sleep"?
- Render free tier hiberna após 15 min de inatividade
- Para sempre-on: upgrade para $7/mês
- OU configure warm-up automático (veja `MIGRATION.md`)

---

**Precisa de ajuda?** Veja `MIGRATION.md` para guia completo
