# CRM Modular B2B

> Projeto de estudo prático em desenvolvimento fullstack — backend .NET + frontend React.

Sistema de CRM modular com gerenciamento de Leads, desenvolvido para consolidar conceitos de **Clean Architecture**, mensageria assíncrona e construção de interfaces modernas com React.

**Estágio atual:** Parte 2 em andamento — desenvolvimento do frontend React integrado ao backend.

---

## Arquitetura

O projeto segue Clean Architecture com separação estrita de responsabilidades em 4 camadas:

```
CRMModular.Domain          → Entidades, interfaces e eventos. Sem dependências externas.
CRMModular.Application     → Casos de uso e DTOs. Depende apenas do Domain.
CRMModular.Infrastructure  → EF Core, PostgreSQL, RabbitMQ. Implementa contratos do Domain.
CRMModular.API             → Controllers ASP.NET, DI registration, Scalar UI.
```

A direção das dependências aponta sempre para dentro: `API → Infrastructure → Application → Domain`. O Domain não conhece nenhuma tecnologia externa.

---

## Stack

| Tecnologia | Uso |
|---|---|
| .NET 10 / ASP.NET Core | API REST |
| Entity Framework Core 10 | ORM e migrations |
| PostgreSQL | Banco de dados relacional |
| RabbitMQ | Broker de mensageria |
| Node.js + amqplib | Microsserviço consumidor de fila |
| Scalar | Interface visual para testes de API |
| Docker | Containers de PostgreSQL e RabbitMQ |

---

## Padrões aplicados

- **Repository Pattern** — `ILeadRepository` no Domain, `LeadRepository` na Infrastructure
- **Dependency Inversion** — Application depende de interfaces, nunca de implementações concretas
- **DTO Pattern** — `CreateLeadDto` protege campos internos da entidade de sobrescrita externa
- **Domain Events** — `LeadCreatedEvent` desacopla a persistência da notificação
- **Multi-tenant** — Global Query Filter no EF Core isola dados por `OrganizationId`
- **Singleton Connection** — conexão TCP com RabbitMQ criada uma vez e reutilizada

---

## Fluxo principal

```
POST /api/leads
    → LeadsController valida entrada via CreateLeadDto
    → LeadApplicationService persiste via ILeadRepository
    → PostgreSQL recebe INSERT
    → LeadCreatedEvent publicado via IMessageProducer
    → RabbitMQ guarda mensagem na fila lead_created_queue
    → Node.js consome e processa notificação
    → 201 Created retornado ao cliente
```

---

## Como executar localmente

**Pré-requisitos:** Docker, .NET 10 SDK, Node.js

**1. Subir containers:**
```bash
docker-compose up -d
```

**2. Aplicar migration:**
```bash
dotnet ef database update --project CRMModular.Infrastructure --startup-project CRMModular.API
```

**3. Subir a API:**
```bash
dotnet run --project CRMModular.API
```

**4. Subir o worker Node.js** (terminal separado):
```bash
cd crm-notification-service
node index.js
```

**5. Acessar Scalar UI:**
```
http://localhost:5151/scalar/v1
```

---

## Estrutura de pastas

```
crm-modular/
├── CRMModular.Domain/
│   ├── Entities/Lead.cs
│   ├── Events/LeadCreatedEvent.cs
│   └── Repositories/ILeadRepository.cs, IMessageProducer.cs
├── CRMModular.Application/
│   ├── DTOs/CreateLeadDto.cs
│   └── Services/LeadApplicationService.cs
├── CRMModular.Infrastructure/
│   ├── Data/ApplicationDbContext.cs
│   ├── Repositories/LeadRepository.cs
│   ├── Messaging/RabbitMqProducer.cs
│   └── Migrations/
├── CRMModular.API/
│   ├── Controllers/LeadsController.cs
│   └── Program.cs
├── crm-notification-service/
│   └── index.js
└── docker-compose.yml
```

---

## Frontend (Parte 2 — em andamento)

SPA em React integrada ao backend via Axios. Módulo de Leads com listagem, busca, criação e modal de edição/exclusão.

**Stack:** React 19 · Vite · Axios · React Router DOM · Tailwind CSS 4 · lucide-react · react-hot-toast

```bash
cd crm-frontend
npm install
npm run dev
# Acesse: http://localhost:5173
```

**Funcionalidades implementadas:**
- Listagem de Leads com paginação e busca (filtro client-side)
- Criação de Lead via modal — integrada e funcionando ponta a ponta
- Modal de edição e exclusão — aguardando `PUT`/`DELETE` no backend

---

## Limitações conhecidas

- Autenticação não implementada — `OrganizationId` está fixo no código
- Se o RabbitMQ estiver indisponível no momento da publicação, o evento se perde (sem Outbox Pattern)

---

## Licença

MIT — veja [LICENSE](LICENSE)
