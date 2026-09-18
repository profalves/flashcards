# ⚡ Como Redeploar no Render (30 segundos)

## 🎯 O que foi arrumado

✅ Remover token npm inválido
✅ Usar registry público
✅ Adicionar flag `--legacy-peer-deps`

## 📋 Passos para Redeploar

### 1. No GitHub ✅ (JÁ FEITO)
```bash
# Eu já fiz isso:
git add -A
git commit -m "fix: npm E401"
git push origin master
```

### 2. No Render (VOCÊ PRECISA FAZER)

**Opção A: Auto-deploy (Automático)**
- Render detectará o novo commit automaticamente
- Deploy começará em 1-2 minutos
- Logs aparecerão em tempo real

**Opção B: Manual Deploy (Imediato)**
1. Acesse https://render.com
2. Selecione `flashcards-api` service
3. Clique botão "Manual Deploy"
4. Escolha branch: `master`
5. Clique "Deploy"

### 3. Acompanhar Progress

No dashboard Render:
- Vá em **flashcards-api**
- Tab **Logs**
- Procure por:
  ```
  ✅ "npm install" - OK
  ✅ "npm run build" - OK
  ✅ "Service running on port 3001" - OK
  ```

### 4. Testar Sucesso

```bash
# Após deploy terminar:
curl https://flashcards-api-xxxx.onrender.com/health

# Esperado:
# {"status":"healthy","timestamp":"2026-09-18T...","uptime":...}
```

## ⏱️ Tempo Estimado

- Build: 2-3 minutos
- Teste: 1 minuto
- **Total: 3-4 minutos**

## 📍 Status

✅ Código corrigido
✅ Pushed para GitHub
⏳ Aguardando seu deploy em Render

---

## 🆘 Se der erro novamente

1. Verifique os logs em Render (tabs "Logs")
2. Procure por erros específicos
3. Se ainda for npm: tente "Manual Restart" no Render dashboard

---

**Pronto?** Vá no Render e clique "Manual Deploy"! 🚀
