# CRM Modular B2B — Parte 1: Clean Architecture + Mensageria

> Primeiro projeto de uma série de estudos práticos em desenvolvimento backend com .NET.

Sistema de CRM modular desenvolvido como projeto de estudo prático de **Clean Architecture** em .NET, com mensageria assíncrona via RabbitMQ e microsserviço de notificações em Node.js.

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

## Limitações conhecidas

- Autenticação não implementada — `OrganizationId` está fixo no código
- Se o RabbitMQ estiver indisponível no momento da publicação, o evento se perde (sem Outbox Pattern)

---

## Licença

MIT — veja [LICENSE](LICENSE)
