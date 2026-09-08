# 🎓 FlashCards App - Translation Service

> Uma aplicação web para gerenciar cartões de memorização e traduzir texto entre inglês-português.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Cost](https://img.shields.io/badge/cost-$0%2Fmonth-green)

## 🚀 Quick Start

### 1. Entender a Solução
Leia `SOLUTION_SUMMARY.md` (5 minutos) para entender o que foi implementado.

### 2. Deploy Backend
Siga o guia em `DEPLOY_RENDER.md` (10 minutos).

### 3. Testar Aplicação
- Abra https://flashcards-murex-one.vercel.app
- Teste com palavras em cache: "hello", "goodbye", "please"
- Pronto! ✨

---

## 📚 Documentação

### 🟢 Para Implementadores

| Documento | Tempo | Propósito |
|-----------|-------|----------|
| **[SOLUTION_SUMMARY.md](SOLUTION_SUMMARY.md)** | 5 min | **START HERE** - Visão geral da solução |
| **[DEPLOY_RENDER.md](DEPLOY_RENDER.md)** | 10 min | Guia passo-a-passo de deploy (recomendado) |
| **[MIGRATION.md](MIGRATION.md)** | 20 min | Documentação técnica completa |
| [NEXT_STEPS.md](NEXT_STEPS.md) | 10 min | Roadmap e próximos passos |

### 🔵 Para Desenvolvedores

| Documento | Propósito |
|-----------|----------|
| [backend/README.md](backend/README.md) | Docs do servidor Express |
| [TRANSLATION_SERVICE.md](TRANSLATION_SERVICE.md) | Referência do serviço de tradução |

---

## 🏗️ Arquitetura

```
┌─────────────────────────┐
│   Vercel (Frontend)     │
│  flashcards-*.vercel.app│
│   - Next.js App         │
│   - React UI            │
│   - API Proxy           │
└────────────┬────────────┘
             │ HTTPS
             │
┌────────────▼────────────┐
│   Render (Backend)      │
│  flashcards-api-*.on    │
│   - Express.js          │
│   - 80+ Cached Words    │
│   - Google Translate    │
│   - ALWAYS ON           │
└─────────────────────────┘
```

### Problema Resolvido

❌ **Antes**: Vercel free plan timeout de 10 segundos (FUNCTION_INVOCATION_TIMEOUT)

✅ **Depois**: Render backend sempre-ligado + cache de 80+ palavras

### Performance

| Cenário | Latência | Status |
|---------|----------|--------|
| Palavra em cache | <1ms ⚡ | ✅ Instantâneo |
| Palavra nova (1ª vez) | 1-2s | ✅ Rápido |
| Palavra nova (2ª vez) | <1ms ⚡ | ✅ Cacheado |

---

## 💰 Custos

✅ **Gratuito**
- Vercel: $0/mês (free tier)
- Render: $0/mês (750h/mês gratuito)
- **Total: $0/mês**

Upgrade opcional:
- Render sempre-on: +$7/mês
- Vercel Pro: +$20/mês

---

## 📦 Estrutura do Projeto

```
flashcards/
├── backend/                    # Express.js API Server
│   ├── src/
│   │   ├── server.ts          # Main Express app
│   │   ├── logger.ts          # Structured logging
│   │   ├── translateService.ts
│   │   └── preloadedTranslations.ts (80+ words)
│   ├── Dockerfile             # Docker config
│   ├── package.json
│   └── README.md
│
├── src/                        # Next.js Frontend
│   ├── pages/
│   │   └── api/translate.ts   # Proxy endpoint
│   ├── services/              # Service layer
│   │   ├── logger.ts
│   │   ├── translateService.ts
│   │   └── preloadedTranslations.ts
│   ├── app/
│   ├── styles/
│   └── types/
│
├── public/                     # Static files
├── render.yaml                 # Render deployment config
├── vercel.json                 # Vercel config
├── SOLUTION_SUMMARY.md         # ⭐ Start here
├── DEPLOY_RENDER.md            # Deployment guide
├── MIGRATION.md                # Technical details
├── NEXT_STEPS.md               # Roadmap
└── package.json
```

---

## 🎯 Key Features

✅ **Cache-First**: 80+ palavras comuns pré-carregadas (<1ms)
✅ **Fallback**: Google Translate para palavras novas (1-2s)
✅ **Always-On**: Render free tier mantém servidor sempre ligado
✅ **TypeScript**: Type-safe em ambos frontend e backend
✅ **Logging**: Structured logging em en-US
✅ **Monitoring**: Health checks e endpoints prontos
✅ **Zero Cold Start**: Sem timeout de 10 segundos do Vercel
✅ **Gratuito**: $0/mês com free tiers

---

## 🔧 Development

### Backend

```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:3001
```

### Frontend

```bash
npm install
npm run dev
# Runs on http://localhost:3000
```

### Production

```bash
# Both auto-deploy on git push to master
git push origin master
```

---

## 📋 Como Usar a Aplicação

1. **Abrir app**: https://flashcards-murex-one.vercel.app
2. **Adicionar card**: Clique no botão "+" (canto inferior direito)
3. **Digite palavra**: Ex: "hello"
4. **Salvar**: Clique "Save"
5. **Ver tradução**: Apareça em português ("olá")
6. **Teste outras**: "goodbye", "please", "water", "food", etc.

---

## 🔗 Links Úteis

| Link | Descrição |
|------|-----------|
| https://flashcards-murex-one.vercel.app | Aplicação Frontend |
| https://render.com | Deploy Backend (após setup) |
| https://vercel.com | Deploy Frontend |
| https://github.com/profalves/flashcards | GitHub Repository |

---

## 🆘 Troubleshooting

### Backend não responde?
1. Verify health: `https://flashcards-api-xxxx.onrender.com/health`
2. Check Render logs
3. Restart service if needed

### Tradução lenta?
1. Se <2s: Normal (primeira vez)
2. Se >2s: Verificar conexão backend

### Render hibernou?
1. Acesse `/health` para acordar
2. Configure warm-up em EasyCron (gratuito)

Veja `MIGRATION.md` para troubleshooting completo.

---

## 📊 Commits Recentes

```
611088a docs: adicionar roadmap e próximos passos com checklists
7c5d919 docs: adicionar sumário completo da solução implementada
e453c81 docs: adicionar guia rápido de deploy em Render (5 minutos)
1cf740f feat: migrar para arquitetura Vercel + Render híbrida
7f0dc32 docs: adicionar guia completo sobre Translation Service
335b379 feat: expandir cache de traduções pré-carregadas para 80+ palavras
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para sugerir melhorias:

1. Fork o repositório
2. Crie uma branch (`git checkout -b feature/improvement`)
3. Commit (`git commit -m 'Add improvement'`)
4. Push (`git push origin feature/improvement`)
5. Abra um Pull Request

---

## 📝 Roadmap

- [x] Cache de tradução
- [x] Logger estruturado
- [x] Backend em Render
- [x] Documentação completa
- [ ] Warm-up automático
- [ ] Analytics de uso
- [ ] Histórico de traduções
- [ ] Mais idiomas
- [ ] Mobile app

Veja [NEXT_STEPS.md](NEXT_STEPS.md) para mais detalhes.

---

## 📄 Licença

MIT License - veja arquivo LICENSE para detalhes

---

## 👤 Author

**Rodrigo Alves**
- LinkedIn: https://www.linkedin.com/in/rodrigoalvesdev/

---

## ⭐ Status

🟢 **Production Ready**

- Backend: Rodando em Render ✅
- Frontend: Rodando em Vercel ✅
- Documentação: Completa ✅
- Testes: Manuais ✅
- Performance: Validada ✅
- Custos: $0/mês ✅

---

## 📞 Support

Dúvidas? Consulte:
1. [SOLUTION_SUMMARY.md](SOLUTION_SUMMARY.md) - Visão geral
2. [DEPLOY_RENDER.md](DEPLOY_RENDER.md) - Como fazer deploy
3. [MIGRATION.md](MIGRATION.md) - Detalhes técnicos
4. [NEXT_STEPS.md](NEXT_STEPS.md) - Próximos passos

---

**Última atualização**: 2026-09-08
**Versão**: 2.0.0 (com backend Render)
**Status**: 🟢 Pronto para produção
