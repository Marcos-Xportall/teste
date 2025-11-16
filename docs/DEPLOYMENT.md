# Guia de Deploy

Este guia explica como fazer deploy do Lasy AI em produção.

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- Conta Vercel (para frontend)
- Conta Railway/Render (para backend)
- Google Gemini API Key
- Stripe Account (para pagamentos)

## 1. Setup do Banco de Dados

### Opção A: Supabase (Recomendado)

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Copie a DATABASE_URL
4. Execute as migrations:

```bash
cd backend
DATABASE_URL="sua-url-aqui" npx prisma migrate deploy
```

### Opção B: Railway

1. Crie uma conta em [railway.app](https://railway.app)
2. Crie um PostgreSQL database
3. Copie a DATABASE_URL
4. Execute as migrations

## 2. Setup do Redis

### Opção A: Redis Cloud

1. Crie uma conta em [redis.com](https://redis.com/try-free/)
2. Crie um database
3. Copie a REDIS_URL

### Opção B: Upstash

1. Crie uma conta em [upstash.com](https://upstash.com)
2. Crie um Redis database
3. Copie a REDIS_URL

## 3. Deploy do Backend

### Opção A: Railway (Recomendado)

1. Instale o Railway CLI:
```bash
npm install -g @railway/cli
```

2. Login:
```bash
railway login
```

3. Crie um novo projeto:
```bash
cd backend
railway init
```

4. Configure as variáveis de ambiente no dashboard da Railway

5. Deploy:
```bash
railway up
```

### Opção B: Render

1. Conecte seu repositório ao Render
2. Crie um novo Web Service
3. Configure:
   - Build Command: `cd backend && npm install && npm run build`
   - Start Command: `cd backend && npm start`
   - Environment: Node
4. Adicione as variáveis de ambiente

### Opção C: AWS/DigitalOcean

1. Configure um servidor Ubuntu
2. Instale Node.js, PM2
3. Clone o repositório
4. Configure variáveis de ambiente
5. Execute:

```bash
cd backend
npm install
npm run build
pm2 start dist/index.js --name lasy-api
```

## 4. Deploy do Frontend

### Vercel (Recomendado)

1. Instale o Vercel CLI:
```bash
npm install -g vercel
```

2. Login:
```bash
vercel login
```

3. Deploy:
```bash
cd frontend
vercel --prod
```

4. Configure as variáveis de ambiente no dashboard:
   - `VITE_API_URL` - URL do backend
   - `VITE_WS_URL` - URL do WebSocket

### Netlify

1. Conecte seu repositório ao Netlify
2. Configure:
   - Build Command: `cd frontend && npm run build`
   - Publish Directory: `frontend/dist`
3. Adicione as variáveis de ambiente

## 5. Configuração de Variáveis de Ambiente

### Backend

Crie um arquivo `.env` no backend com:

```env
# Database
DATABASE_URL="postgresql://..."

# Redis
REDIS_URL="redis://..."

# JWT
JWT_SECRET="seu-secret-super-seguro-aqui"
JWT_EXPIRES_IN="7d"

# Gemini API
GEMINI_API_KEY="sua-chave-aqui"
GEMINI_MODEL="gemini-2.0-flash-exp"

# Vercel
VERCEL_TOKEN="seu-token-vercel"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NODE_ENV="production"
PORT="3000"
FRONTEND_URL="https://seu-dominio.com"

# Credits
DEFAULT_FREE_CREDITS="100"
CREDIT_COST_GENERATE_APP="50"
CREDIT_COST_EDIT_COMPONENT="5"
CREDIT_COST_DEPLOY="10"
CREDIT_COST_AI_CALL="2"
```

### Frontend

Crie um arquivo `.env.production` no frontend:

```env
VITE_API_URL=https://api.seu-dominio.com/api
VITE_WS_URL=wss://api.seu-dominio.com
```

## 6. Setup do Stripe

1. Crie produtos no Stripe Dashboard:
   - Starter: R$ 47/mês
   - Pro: R$ 97/mês
   - Scale: R$ 297/mês

2. Configure o Webhook:
   - URL: `https://api.seu-dominio.com/api/payments/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.deleted`

3. Copie o Webhook Secret

## 7. DNS e SSL

### Cloudflare (Recomendado)

1. Adicione seu domínio ao Cloudflare
2. Configure DNS records:
   ```
   A    @              -> IP do backend
   CNAME www           -> seu-dominio.com
   CNAME api           -> backend-url
   ```
3. Ative SSL/TLS (Full)
4. Ative Auto HTTPS Rewrites

## 8. Migrations de Produção

```bash
cd backend
DATABASE_URL="production-url" npx prisma migrate deploy
```

## 9. Monitoramento

### Sentry (Recomendado)

1. Crie uma conta em [sentry.io](https://sentry.io)
2. Crie dois projetos: frontend e backend
3. Instale o SDK:

```bash
npm install @sentry/node @sentry/react
```

4. Configure no código

### Logs

Backend com PM2:
```bash
pm2 logs lasy-api
pm2 monit
```

## 10. Backup

### Database

Configurar backup automático:

**Supabase**: Backups automáticos inclusos

**Railway**: Configure no dashboard

**Próprio servidor**:
```bash
# Criar backup
pg_dump $DATABASE_URL > backup.sql

# Restaurar
psql $DATABASE_URL < backup.sql
```

### Redis

```bash
# Criar snapshot
redis-cli BGSAVE

# Backup automático
redis-cli CONFIG SET save "900 1 300 10"
```

## 11. Checklist de Segurança

- [ ] HTTPS habilitado
- [ ] Variáveis de ambiente seguras
- [ ] Rate limiting ativo
- [ ] CORS configurado
- [ ] Helmet habilitado
- [ ] Secrets rotacionados
- [ ] Database backups configurados
- [ ] Logs de audit ativos
- [ ] 2FA no Stripe
- [ ] Firewall configurado

## 12. Performance

### CDN

Configure Cloudflare CDN para assets estáticos

### Caching

Redis já configurado para:
- Sessões
- Resultados de queries frequentes
- Rate limiting

### Database

Criar índices importantes:
```sql
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_project_user ON projects(user_id);
CREATE INDEX idx_project_status ON projects(status);
```

## 13. CI/CD

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## 14. Custos Estimados

Para 1000 usuários ativos:

| Serviço | Custo Mensal |
|---------|--------------|
| Vercel Pro | $20 |
| Railway (Backend) | $20 |
| Supabase Pro | $25 |
| Redis Cloud | $15 |
| Cloudflare | $0 |
| Gemini API | $100-300 |
| Stripe | 2.9% + $0.30/tx |
| **Total** | **~$200-400** |

## 15. Troubleshooting

### Backend não inicia

```bash
# Verificar logs
pm2 logs lasy-api

# Verificar conexão database
psql $DATABASE_URL

# Verificar conexão redis
redis-cli -u $REDIS_URL ping
```

### Migrations falhando

```bash
# Reset database (CUIDADO!)
npx prisma migrate reset

# Forçar deploy
npx prisma migrate deploy --force
```

### WebSocket não conecta

- Verificar CORS configurado
- Verificar URL do WebSocket
- Verificar firewall/load balancer permite WS

## 16. Contato e Suporte

- Email: support@lasyai.com
- Discord: [Link]
- Documentação: [docs.lasyai.com]

## 17. Próximos Passos

- [ ] Configurar monitoring
- [ ] Setup de staging environment
- [ ] Documentar runbook de incidentes
- [ ] Setup de disaster recovery
- [ ] Performance testing
