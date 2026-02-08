---
alwaysApply: true
---

# Regras de Organização de Documentação

## Estrutura de Diretórios

Toda documentação do projeto deve ser armazenada em `apps/docs/` com a seguinte estrutura:

```
apps/docs/
├── tech_docs/           # Documentação técnica
│   ├── 001-setup.md
│   ├── 002-architecture.md
│   └── 003-deployment.md
└── business_docs/       # Documentação de negócio
    ├── 001-requirements.md
    ├── 002-user-flows.md
    └── 003-business-rules.md
```

## Regras de Armazenamento

### 1. Documentação Técnica (`apps/docs/tech_docs/`)

**Armazene aqui:**
- Guias de setup e instalação
- Documentação de arquitetura
- Guias de deployment e DevOps
- Documentação de APIs
- Guias de desenvolvimento
- Diagramas técnicos (arquitetura, infraestrutura, ER diagrams)
- Troubleshooting guides
- Documentação de configuração

**Exemplos de arquivos:**
- `001-setup-guide.md`
- `002-docker-configuration.md`
- `003-api-architecture.md`
- `004-database-schema.md`
- `005-ci-cd-pipeline.md`

### 2. Documentação de Negócio (`apps/docs/business_docs/`)

**Armazene aqui:**
- Requisitos funcionais e não-funcionais
- Regras de negócio
- Fluxos de usuário (user flows)
- Casos de uso (use cases)
- Especificações de features
- Diagramas de processo de negócio
- Documentação de domínio (DDD)
- Product requirements documents (PRD)

**Exemplos de arquivos:**
- `001-project-requirements.md`
- `002-user-authentication-flow.md`
- `003-workout-generation-rules.md`
- `004-meal-plan-business-logic.md`
- `005-user-onboarding-flow.md`

## Convenções de Nomenclatura

### Formato Obrigatório

```
[número]-[nome-descritivo].[extensão]
```

**Regras:**
- Número: 3 dígitos sequenciais (001, 002, 003...)
- Nome: kebab-case, descritivo e claro
- Extensões permitidas: `.md`, `.doc`, `.docx`, `.pdf`, `.mmd` (Mermaid), `.drawio`

**Exemplos válidos:**
- ✅ `001-setup-guide.md`
- ✅ `002-authentication-flow.md`
- ✅ `003-database-er-diagram.mmd`
- ✅ `004-deployment-architecture.drawio`

**Exemplos inválidos:**
- ❌ `setup.md` (sem número)
- ❌ `1-setup.md` (número não tem 3 dígitos)
- ❌ `001_setup_guide.md` (usa underscore)
- ❌ `Setup Guide.md` (espaços, PascalCase)

## Tipos de Arquivos Aceitos

- **Markdown**: `.md` (preferencial)
- **Word**: `.doc`, `.docx`
- **PDF**: `.pdf` (apenas para documentos finais)
- **Diagramas**: `.mmd` (Mermaid), `.drawio`, `.png`, `.svg`

## Comportamento da IA

Quando trabalhar com documentação:

1. **NUNCA** criar arquivos de documentação na raiz do projeto
2. **SEMPRE** usar a estrutura `apps/docs/tech_docs/` ou `apps/docs/business_docs/`
3. **SEMPRE** numerar arquivos sequencialmente
4. **SEMPRE** usar kebab-case para nomes
5. **PERGUNTAR** ao usuário qual tipo de documentação antes de criar
6. **SUGERIR** um nome descritivo se o usuário não especificar
7. **VERIFICAR** se já existe documentação similar antes de criar nova

## Exemplos de Uso

### Cenário 1: Criar Documentação Técnica

```bash
# ❌ ERRADO
/SETUP_GUIDE.md
/docs/setup.md

# ✅ CORRETO
apps/docs/tech_docs/001-setup-guide.md
apps/docs/tech_docs/002-docker-configuration.md
```

### Cenário 2: Criar Documentação de Negócio

```bash
# ❌ ERRADO
/REQUIREMENTS.md
/business/user-flows.md

# ✅ CORRETO
apps/docs/business_docs/001-project-requirements.md
apps/docs/business_docs/002-user-authentication-flow.md
```

### Cenário 3: Diagramas

```bash
# ✅ Diagrama técnico
apps/docs/tech_docs/003-system-architecture.mmd
apps/docs/tech_docs/004-database-er-diagram.drawio

# ✅ Diagrama de negócio
apps/docs/business_docs/003-checkout-process-flow.mmd
apps/docs/business_docs/004-user-journey-map.drawio
```

## Migração de Arquivos Existentes

Se encontrar arquivos de documentação fora da estrutura padrão:

1. Identificar se é documentação técnica ou de negócio
2. Mover para o diretório apropriado
3. Renomear seguindo as convenções
4. Atualizar referências no código e outros documentos
5. Deletar o arquivo original

**Exemplo:**
```bash
# Arquivo atual
/SETUP_GUIDE.md

# Mover e renomear para
apps/docs/tech_docs/001-setup-guide.md
```

## Estrutura de Índice (README)

Cada diretório deve ter um `README.md` (sem número) listando todos os documentos:

```markdown
# Documentação Técnica

## Índice

- [001 - Setup Guide](./001-setup-guide.md)
- [002 - Docker Configuration](./002-docker-configuration.md)
- [003 - API Architecture](./003-api-architecture.md)
```

## Exceções

Os seguintes arquivos podem ficar na raiz:
- `README.md` (principal do projeto)
- `CONTRIBUTING.md`
- `LICENSE.md`
- `CHANGELOG.md`
- `.cursorrules`

Todos os outros devem seguir a estrutura de `apps/docs/`.
