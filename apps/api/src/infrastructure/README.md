# Infrastructure Layer

Esta camada implementa os detalhes técnicos e integrações externas.

## Estrutura

- **database/**: Prisma ORM e implementações de repositórios
- **http/**: Fastify server, controllers, routes, middlewares
- **ai/**: Integrações com Claude/GPT
- **storage/**: S3/R2 para upload de arquivos
- **cache/**: Redis para caching
- **queue/**: BullMQ para jobs em background
- **notifications/**: Push notifications

## Regras

- ✅ Implementa interfaces do domain/application
- ✅ Lida com todos os detalhes técnicos
- ✅ Pode importar frameworks e bibliotecas externas
- ✅ Repositórios fazem mapeamento entre domain e persistence
