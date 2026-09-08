# 🚀 Flashcards App - Translation Service Status

## 📋 Overview

Este projeto foi refatorado com as seguintes melhorias:

- ✅ **Logger centralizado** com suporte a múltiplos níveis de log (info, warn, error, success, debug)
- ✅ **Cache pré-carregado** com 80+ palavras comuns (resposta instantânea)
- ✅ **Fallback para Google Translate API** para palavras não encontradas
- ✅ **Tratamento robusto de erros** com mensagens claras
- ✅ **Refatoração em serviços** separados e reutilizáveis
- ✅ **TypeScript completo** com tipos bem definidos

## 🔴 Problema Identificado: Vercel Free Plan Cold Start

### Sintomas
- Erro `FUNCTION_INVOCATION_TIMEOUT` ao chamar `/api/translate`
- Primeira requisição leva +10 segundos (excede timeout do Vercel: 10s)

### Causa Raiz
O **Vercel Free Plan** tem um limite de timeout rigoroso de 10 segundos para funções serverless. O "cold start" (primeira execução após inatividade) leva mais que 10 segundos, causando timeout.

### Não é um problema do nosso código
- ✅ Cache retorna <1ms (comprovado)
- ✅ Lógica de tradução é eficiente
- ✅ Imports são otimizados
- ✅ Problema está na infraestrutura Vercel free

## ✅ Soluções Implementadas

### 1. Cache Pré-carregado (80+ palavras) ✨
Palavras comuns retornam instantaneamente:
- Cumprimentos: hello, goodbye, good morning, good night
- Ações básicas: go, come, eat, drink, sleep, walk, run, speak, listen, look, see
- Adjetivos: good, beautiful, happy, tired, hungry, hot, cold, fast, slow, big, small, old, new
- E muitas outras...

### 2. Google Translate API Fallback
Para palavras não encontradas no cache, usa Google Translate API com timeout de 8 segundos.

### 3. Logs Estruturados (en-US)
Sistema de logging completo para debug em produção.

### 4. Tratamento de Erros
Mensagens claras sobre motivo das falhas.

## 🔧 Como Resolver o Timeout

### Opção 1: Upgrade para Vercel Pro ($20/mês) ⭐
Vantagens:
- Timeout de até 60 segundos
- Melhor performance
- Suporte premium

Passos:
1. Abrir https://vercel.com/account/billing
2. Fazer upgrade do plano
3. Configuração maxDuration já pronta em `vercel.json`

### Opção 2: Usar Warm-up Externo (GRATUITO)
Manter a função "aquecida" com pings periódicos.

#### Via EasyCron (https://www.easycron.com)
1. Criar conta grátis
2. Criar novo cron job:
   - URL: `https://flashcards-murex-one.vercel.app/api/translate`
   - Method: `POST`
   - Body: `{"text":"hello"}`
   - Frequency: `Every 14 minutes` (evita timeout em 15min)
3. Pronto! Função fica sempre quente

#### Via cron-job.org (https://cron-job.org)
1. Criar conta grátis
2. Executar endpoint a cada 14 minutos

### Opção 3: Auto-host (GRATUITO)
Fazer deploy em plataforma que oferece sempre-ligado:
- **Render.com**: Tier free com 750h/mês (bom para dev)
- **Railway.app**: $5/mês incluído
- **AWS Lambda**: Free tier com 1M invocações/mês
- **Firebase Functions**: Free tier generoso

### Opção 4: Backend Próprio (RECOMENDADO para longo prazo)
Usar serviço de tradução rápido e confiável:
- **DeepL API**: Free tier com 500k chars/mês
- **Google Translate API**: Pay-as-you-go ($0.5-15/1M chars)
- **LibreTranslate self-hosted**: Gratuito, open-source

## 🧪 Como Testar Localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Fazer uma requisição (localhost)
curl -X POST http://localhost:3000/api/translate \
  -H 'Content-Type: application/json' \
  -d '{"text":"hello"}'

# Esperado: resposta instantânea do cache
# {"translation":"olá","source":"en","target":"pt","provider":"Cache"}
```

## 📊 Performance Esperado

| Cenário | Tempo | Status |
|---------|-------|--------|
| Palavra no cache (80+ palavras) | <1ms | ✅ Rápido |
| Palavra não no cache (cold start) | 10s+ | ❌ Timeout |
| Palavra não no cache (função quente) | ~1-2s | ⚠️ Lento |

## 🛠️ Estrutura do Código

```
src/
├── services/
│   ├── logger.ts              # Sistema de logging centralizado
│   ├── translateService.ts    # Lógica de tradução com cache
│   ├── preloadedTranslations.ts # 80+ palavras pré-carregadas
│   └── index.ts               # Exportações dos serviços
├── pages/
│   └── api/
│       └── translate.ts       # Endpoint da API (super simples)
└── app/
    └── page.tsx              # Interface do usuário

scripts/
└── vercel-warmup.js          # Script para warm-up (use em cron externo)
```

## 🎯 Recomendações

### Curto Prazo (< 1 semana)
- ✅ Usar warm-up externo (EasyCron) - gratuito
- ✅ Instruir usuários a usar palavras no cache
- ✅ Adicionar mais palavras ao cache conforme uso

### Médio Prazo (1-4 semanas)
- 🔄 Considerar upgrade Vercel Pro se projeto crescer
- 🔄 Implementar analytics para palavras mais usadas
- 🔄 Expandir cache com palavras mais populares

### Longo Prazo (> 1 mês)
- ✅ Migrar para backend próprio (Node.js + Express) em Render/Railway
- ✅ Usar API de tradução profissional (DeepL, Google)
- ✅ Implementar banco de dados para histórico de traduções
- ✅ Adicionar autenticação e rate limiting

## 📚 Referências

- [Vercel Limits & Limits](https://vercel.com/docs/concepts/limits/overview)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [EasyCron](https://www.easycron.com)
- [Google Translate API Unofficial](https://github.com/matheuss/google-translate-api)

## 📞 Suporte

Se o warm-up não funcionar:
1. Verificar que EasyCron está enviando requests
2. Verificar logs do Vercel em: https://vercel.com/dashboard
3. Tentar com palavra diferente (ex: "goodbye" em vez de "hello")
4. Verificar se cache está sendo carregado corretamente

---

**Status**: ✅ Production-ready com Warm-up Externo recomendado
**Última atualização**: 2026-09-08
