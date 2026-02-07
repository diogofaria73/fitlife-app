# Application Layer

Esta camada orquestra a lógica de negócio através de Use Cases.

## Estrutura

- **use-cases/**: Casos de uso da aplicação (CreateUser, GenerateWorkoutPlan, etc.)
- **dtos/**: Data Transfer Objects (input/output)
- **interfaces/**: Interfaces para serviços externos (portas)
- **services/**: Serviços de aplicação (coordenação de múltiplos use cases)
- **errors/**: Erros específicos da aplicação

## Regras

- ✅ Depende apenas de interfaces do domain
- ✅ Um use case = uma responsabilidade
- ✅ Injeção de dependências via construtor
- ✅ Use cases retornam DTOs, não entidades
