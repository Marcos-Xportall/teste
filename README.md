# 🚀 Lasy AI - Sistema de Criação de Sites com IA

Sistema completo de geração de aplicativos web usando Inteligência Artificial, inspirado no Lasy.ai.

## 📋 Visão Geral

Plataforma que permite criar aplicativos completos e funcionais através de descrições em linguagem natural, com preview em tempo real, edição visual e deploy automático.

## 🏗️ Arquitetura

```
lasy-ai/
├── frontend/          # React + TypeScript + Vite + Tailwind
├── backend/           # Node.js + Express + TypeScript
├── shared/            # Tipos compartilhados
└── docs/             # Documentação
```

## ✨ Funcionalidades

### MVP (Fase 1)
- ✅ Sistema de autenticação (JWT)
- ✅ Integração com Gemini API
- ✅ Geração de código (HTML/CSS/JS/React)
- ✅ Preview em tempo real
- ✅ Deploy automático (Vercel)
- ✅ Dashboard de projetos
- ✅ Sistema de créditos

### Futuras
- 🔄 Editor visual avançado
- 🔄 Upload de referências (screenshots/PDFs)
- 🔄 Integração GitHub
- 🔄 Auto-setup Supabase
- 🔄 Colaboração em equipe
- 🔄 Marketplace de templates

## 🛠️ Stack Tecnológica

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- shadcn/ui components
- React Router
- Zustand (state)
- React Query (data fetching)
- Monaco Editor (code editing)

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- Redis (cache/sessions)
- JWT (autenticação)
- Bull (job queues)
- WebSockets (real-time)

### AI & Serviços
- Google Gemini API (geração)
- Vercel API (deploy)
- Stripe (pagamentos)
- AWS S3 (storage)

## 🚦 Início Rápido

### Pré-requisitos
```bash
node >= 18.x
npm >= 9.x
postgresql >= 14.x
redis >= 7.x
```

### Instalação

1. Clone o repositório
```bash
git clone <repo-url>
cd teste
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite .env com suas credenciais
```

4. Configure o banco de dados
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

5. Inicie o desenvolvimento
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📦 Scripts Disponíveis

### Raiz
```bash
npm run dev           # Inicia frontend + backend
npm run build         # Build de produção
npm run test          # Executa testes
npm run lint          # Lint do código
```

### Frontend
```bash
npm run dev           # Dev server (http://localhost:5173)
npm run build         # Build de produção
npm run preview       # Preview do build
```

### Backend
```bash
npm run dev           # Dev server (http://localhost:3000)
npm run build         # Compila TypeScript
npm run start         # Inicia servidor de produção
npm run migrate       # Executa migrations
```

## 🔑 Variáveis de Ambiente

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lasyai"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="your-secret-key-here"
JWT_EXPIRES_IN="7d"

# Gemini API
GEMINI_API_KEY="your-gemini-api-key"

# Vercel API
VERCEL_TOKEN="your-vercel-token"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="lasyai-uploads"
```

### Frontend (.env)
```env
VITE_API_URL="http://localhost:3000/api"
VITE_WS_URL="ws://localhost:3000"
```

## 📊 Estrutura do Banco de Dados

```prisma
User
- id, email, password, name, plan, credits

Project
- id, name, description, userId, status, code

Deployment
- id, projectId, url, status, provider

Transaction
- id, userId, amount, type, credits
```

## 🎯 Roadmap

### Fase 1 (Mês 1-2) - Fundação
- [x] Setup de infraestrutura
- [x] Sistema de autenticação
- [x] Integração Gemini básica
- [x] Preview de projetos

### Fase 2 (Mês 3-4) - Core Features
- [ ] Engine de geração de código
- [ ] Editor visual básico
- [ ] Sistema de templates
- [ ] Deploy automático

### Fase 3 (Mês 5-6) - Monetização
- [ ] Sistema de créditos
- [ ] Integração Stripe
- [ ] Dashboard de usuário
- [ ] Analytics

### Fase 4 (Mês 7+) - Features Avançadas
- [ ] Colaboração
- [ ] GitHub integration
- [ ] Marketplace
- [ ] Whitelabel

## 💰 Modelo de Negócio

### Planos
- **Starter**: R$ 47/mês - 500 créditos
- **Pro**: R$ 97/mês - 2000 créditos
- **Scale**: R$ 297/mês - 10000 créditos

### Custos por Ação
- Gerar app completo: 50 créditos
- Editar componente: 5 créditos
- Deploy: 10 créditos
- Chamada IA: 2 créditos

## 🧪 Testes

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test

# E2E
npm run test:e2e
```

## 📝 Documentação

- [Arquitetura](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Guia de Deploy](./docs/DEPLOYMENT.md)
- [Contribuindo](./docs/CONTRIBUTING.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👥 Equipe

- Desenvolvedor Full-Stack
- Designer UI/UX
- DevOps Engineer

## 📞 Suporte

- Email: support@lasyai.com
- Discord: [Link do Discord]
- Documentação: [docs.lasyai.com]

---

Feito com ❤️ usando IA
