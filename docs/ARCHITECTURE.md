# Arquitetura do Sistema

## Visão Geral

O Lasy AI é um sistema de geração de aplicativos web usando IA, estruturado como um monorepo com 3 principais módulos:

```
lasy-ai/
├── frontend/     # React SPA
├── backend/      # Node.js API
└── shared/       # Tipos compartilhados
```

## Stack Tecnológica

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Zustand** - State Management
- **React Query** - Server State
- **React Router** - Routing
- **Monaco Editor** - Code Editing
- **Socket.IO Client** - Real-time Updates

### Backend
- **Node.js + Express** - API Server
- **TypeScript** - Type Safety
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Redis** - Caching/Sessions
- **Socket.IO** - WebSockets
- **JWT** - Authentication
- **Bull** - Job Queues
- **Stripe** - Payments

### External Services
- **Google Gemini API** - AI Code Generation
- **Vercel API** - Deployment
- **AWS S3** - File Storage (optional)

## Arquitetura de Alto Nível

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│             │         │             │         │             │
│   React     │◄───────►│   Express   │◄───────►│  PostgreSQL │
│   Frontend  │  HTTP   │   Backend   │         │  Database   │
│             │         │             │         │             │
└─────────────┘         └─────────────┘         └─────────────┘
      │                       │
      │                       │
      │ WebSocket             │ API Calls
      │                       │
      ▼                       ▼
┌─────────────┐         ┌─────────────┐
│  Socket.IO  │         │   Gemini    │
│   Server    │         │     API     │
└─────────────┘         └─────────────┘
                              │
                              │
                              ▼
                        ┌─────────────┐
                        │   Vercel    │
                        │     API     │
                        └─────────────┘
```

## Fluxo de Dados Principal

### 1. Criação de Projeto

```
User Input → Frontend → Backend → Gemini API
                                      ↓
Frontend ← WebSocket ← Backend ← AI Response
     ↓
  Monaco Editor → Code Preview
```

### 2. Deploy de Projeto

```
User Action → Frontend → Backend → Vercel API
                                       ↓
Frontend ← WebSocket ← Backend ← Deployment URL
```

### 3. Sistema de Créditos

```
API Call → Middleware (checkCredits) → Deduct Credits
                                           ↓
                                    Update Database
                                           ↓
                                    Create Transaction
```

## Estrutura do Backend

```
backend/
├── src/
│   ├── controllers/       # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── project.controller.ts
│   │   ├── ai.controller.ts
│   │   ├── user.controller.ts
│   │   └── payment.controller.ts
│   │
│   ├── services/          # Business logic
│   │   ├── ai.service.ts
│   │   ├── deploy.service.ts
│   │   └── credits.service.ts
│   │
│   ├── middleware/        # Express middlewares
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   │
│   ├── routes/            # API routes
│   │   ├── auth.routes.ts
│   │   ├── project.routes.ts
│   │   ├── ai.routes.ts
│   │   ├── user.routes.ts
│   │   └── payment.routes.ts
│   │
│   ├── config/            # Configuration
│   │   ├── database.ts
│   │   └── redis.ts
│   │
│   └── index.ts           # Entry point
│
└── prisma/
    └── schema.prisma      # Database schema
```

## Estrutura do Frontend

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Button.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PrivateRoute.tsx
│   │   └── PublicRoute.tsx
│   │
│   ├── pages/             # Page components
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── EditorPage.tsx
│   │   ├── ProjectsPage.tsx
│   │   └── SettingsPage.tsx
│   │
│   ├── stores/            # Zustand stores
│   │   ├── authStore.ts
│   │   └── projectStore.ts
│   │
│   ├── services/          # API services
│   │   └── api.ts
│   │
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utilities
│   ├── types/             # TypeScript types
│   ├── styles/            # Global styles
│   │   └── globals.css
│   │
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
```

## Banco de Dados (Prisma Schema)

### Modelos Principais

1. **User** - Usuários do sistema
   - Autenticação
   - Plano e créditos
   - Perfil

2. **Project** - Projetos criados
   - Código gerado (JSON)
   - Status de geração
   - Relacionamento com User

3. **Deployment** - Histórico de deploys
   - URL do deploy
   - Status
   - Relacionamento com Project

4. **Transaction** - Transações financeiras
   - Compra/uso de créditos
   - Histórico de pagamentos

## Autenticação e Autorização

### JWT Flow

```
1. Login → Backend validates credentials
2. Backend generates JWT token
3. Frontend stores token (localStorage via Zustand)
4. Frontend sends token in Authorization header
5. Backend middleware validates token
6. Backend attaches user to req.user
```

### Middleware Chain

```
Request → Rate Limiter → Auth Middleware → Credits Check → Controller
```

## Sistema de Geração de Código

### Prompt Engineering

```javascript
System Prompt
    ↓
User Prompt
    ↓
Context (optional)
    ↓
Gemini API
    ↓
JSON Response { html, css, javascript }
    ↓
Validation & Parsing
    ↓
Store in Database
    ↓
WebSocket Notification
```

### Code Structure

```json
{
  "html": "<!DOCTYPE html>...",
  "css": "body { ... }",
  "javascript": "console.log('...')"
}
```

## Sistema de Deploy

### Vercel Integration

```
1. Project Ready → Deploy button
2. Generate deployment files
3. Create Vercel deployment via API
4. Poll deployment status
5. Update database with URL
6. Notify user via WebSocket
```

## Real-time Updates (WebSocket)

### Events

- `code-generated` - Código foi gerado
- `code-generation-failed` - Erro na geração
- `deployment-success` - Deploy concluído
- `deployment-failed` - Erro no deploy

### Room Structure

```
project:{projectId} - Sala específica do projeto
```

## Segurança

### Medidas Implementadas

1. **Helmet** - Security headers
2. **Rate Limiting** - Proteção contra abuse
3. **JWT** - Autenticação stateless
4. **Bcrypt** - Hash de senhas
5. **CORS** - Controle de origem
6. **Input Validation** - Zod schemas
7. **Error Handling** - Não vazar informações sensíveis

## Performance

### Otimizações

1. **Redis Cache** - Sessions e dados frequentes
2. **Database Indexes** - Queries otimizadas
3. **Compression** - Resposta comprimida
4. **Code Splitting** - Frontend lazy loading
5. **CDN** - Assets estáticos
6. **WebSocket** - Comunicação eficiente

## Escalabilidade

### Horizontal Scaling

- Backend: Multiple instances atrás de load balancer
- Database: Read replicas
- Redis: Cluster mode
- WebSocket: Socket.IO com Redis adapter

### Vertical Scaling

- Database: Upgrade de recursos
- Redis: Mais memória
- Compute: Mais CPU/RAM

## Monitoramento

### Métricas Importantes

- API Response Time
- Error Rate
- Active Users
- Credits Usage
- Deployment Success Rate
- AI API Latency

### Logs

- Application logs (Morgan)
- Error logs
- Audit logs (transactions)

## Deployment

### Production Setup

```
Frontend: Vercel/Netlify
Backend: Railway/Render/AWS
Database: Supabase/Railway
Redis: Redis Cloud/Upstash
```

### Environment Variables

Ver `.env.example` em cada módulo

## Manutenção

### Database Migrations

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### Dependencies Update

```bash
npm update
npm audit fix
```

## Próximos Passos

1. Implementar testes automatizados
2. CI/CD pipeline
3. Monitoring e alertas
4. Documentação da API (Swagger)
5. Performance profiling
6. Feature flags
