# Domain Layer

Esta camada contém a lógica de negócio pura do FitLife.

## Estrutura

- **entities/**: Entidades de domínio (User, WorkoutPlan, MealPlan, etc.)
- **value-objects/**: Objetos de valor imutáveis (Email, Password, Weight, etc.)
- **repositories/**: Interfaces de repositórios (contratos)
- **services/**: Serviços de domínio (lógica que não pertence a uma entidade)
- **errors/**: Erros específicos do domínio
- **events/**: Eventos de domínio

## Regras

- ❌ Nenhuma importação de frameworks ou infraestrutura
- ✅ Apenas lógica de negócio pura
- ✅ TypeScript puro com tipos explícitos
- ✅ Entities e Value Objects devem ser testáveis sem mocks
