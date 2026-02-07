---
description: Workflow Git, conventional commits e estratégia de branches
alwaysApply: false
---

# Git Workflow Standards

## Conventional Commits

### Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **refactor**: Refatoração de código (sem mudança de comportamento)
- **docs**: Alterações em documentação
- **test**: Adição ou modificação de testes
- **chore**: Tarefas de manutenção (build, CI, dependências)
- **perf**: Melhorias de performance
- **style**: Formatação de código (sem mudança de lógica)
- **ci**: Alterações em CI/CD
- **revert**: Reverter commit anterior

### Exemplos

```bash
# Feature
git commit -m "feat: add user authentication endpoint"
git commit -m "feat(auth): implement JWT token refresh logic"

# Fix
git commit -m "fix: correct workout plan date calculation"
git commit -m "fix(api): handle null values in meal plan response"

# Refactor
git commit -m "refactor: improve AI service error handling"
git commit -m "refactor(domain): extract email validation to value object"

# Docs
git commit -m "docs: update API documentation for workout endpoints"
git commit -m "docs: add README for mobile app setup"

# Test
git commit -m "test: add unit tests for User entity"
git commit -m "test(api): add integration tests for auth endpoints"

# Chore
git commit -m "chore: update dependencies"
git commit -m "chore: configure ESLint rules"
```

### Breaking Changes

```bash
# Breaking change indicator
git commit -m "feat!: change workout plan API response structure

BREAKING CHANGE: WorkoutPlan response now includes nested weeks array
instead of flat structure. Update frontend to handle new format.

Migration guide: https://docs.fitlife.com/migration/v2"
```

### Mensagens com Corpo

```bash
git commit -m "feat: implement workout plan generation with AI

Added integration with Claude AI API to generate personalized
workout plans based on user profile and preferences.

- Created AIService interface
- Implemented ClaudeAIService
- Added fallback to GPT-4o-mini
- Added caching for generated plans (5 min TTL)

Closes #45"
```

## Branch Strategy

### Nomenclatura de Branches

```bash
# Features
feature/user-authentication
feature/workout-plan-generation
feature/meal-tracking

# Bug fixes
bugfix/login-validation
bugfix/workout-date-calculation

# Hotfixes (production)
hotfix/security-patch
hotfix/critical-api-error

# Releases
release/v1.0.0
release/v1.1.0

# Improvements
improvement/optimize-db-queries
improvement/enhance-error-messages
```

### Workflow

```bash
# 1. Criar branch a partir de main
git checkout main
git pull origin main
git checkout -b feature/user-profile-page

# 2. Fazer commits atômicos
git add src/pages/profile/
git commit -m "feat: add user profile page layout"

git add src/components/profile-form/
git commit -m "feat: add profile edit form"

# 3. Manter branch atualizada
git checkout main
git pull origin main
git checkout feature/user-profile-page
git rebase main  # ou git merge main

# 4. Push para remote
git push origin feature/user-profile-page

# 5. Criar Pull Request

# 6. Após merge, deletar branch local e remote
git checkout main
git pull origin main
git branch -d feature/user-profile-page
git push origin --delete feature/user-profile-page
```

## Commits

### Commits Atômicos

```bash
# ✅ GOOD - commits separados por contexto
git commit -m "feat: add User entity"
git commit -m "feat: add UserRepository interface"
git commit -m "feat: implement PrismaUserRepository"

# ❌ BAD - commit muito grande
git commit -m "feat: add complete user management system"
```

### Mensagens Claras

```bash
# ✅ GOOD - mensagens descritivas
git commit -m "fix: prevent duplicate email registration"
git commit -m "refactor: extract validation logic to separate service"
git commit -m "perf: add database indexes for workout queries"

# ❌ BAD - mensagens vagas
git commit -m "fix bug"
git commit -m "updates"
git commit -m "WIP"
```

### Commits Focados

```bash
# ✅ GOOD - uma mudança lógica por commit
git commit -m "feat: add email validation to User entity"

# ❌ BAD - múltiplas mudanças não relacionadas
git commit -m "feat: add email validation, fix date bug, update deps"
```

## Pull Requests

### Template de PR

```markdown
## Descrição

Breve descrição do que foi implementado/corrigido.

## Tipo de Mudança

- [ ] Bug fix (mudança que corrige um problema)
- [ ] New feature (mudança que adiciona funcionalidade)
- [ ] Breaking change (fix ou feature que causa quebra de compatibilidade)
- [ ] Refactoring (mudança que não adiciona funcionalidade nem corrige bugs)
- [ ] Documentation (atualização de documentação)

## Como Testar

1. Passo 1
2. Passo 2
3. Verificar resultado esperado

## Checklist

- [ ] Código segue os padrões do projeto
- [ ] Self-review realizado
- [ ] Comentários adicionados em código complexo
- [ ] Documentação atualizada
- [ ] Testes adicionados/atualizados
- [ ] Testes passando localmente
- [ ] Sem warnings do linter

## Screenshots (se aplicável)

[Adicionar screenshots da UI]

## Issues Relacionadas

Closes #123
Related to #456
```

### Tamanho de PRs

```bash
# ✅ GOOD - PR focado (< 400 linhas)
- Implementa apenas a feature de login
- 250 linhas alteradas
- Fácil de revisar

# ❌ BAD - PR muito grande (> 1000 linhas)
- Implementa todo o sistema de autenticação + perfil + configurações
- 1500 linhas alteradas
- Difícil de revisar, maior chance de bugs
```

### Boas Práticas de PR

1. **Título descritivo**: `feat: add user authentication with JWT`
2. **Descrição completa**: Contexto, implementação, impacto
3. **Screenshots**: Para mudanças de UI
4. **Testes**: Sempre incluir testes
5. **Revisão própria**: Fazer self-review antes de solicitar review
6. **Responder comentários**: Responder todos os comentários de review
7. **Manter atualizado**: Fazer rebase/merge com main regularmente

## Git Hooks

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linter failed. Fix errors before committing."
  exit 1
fi

# Run type check
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type check failed. Fix errors before committing."
  exit 1
fi

# Run tests
npm run test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Fix tests before committing."
  exit 1
fi

echo "✅ Pre-commit checks passed!"
```

### Commit-msg Hook

```bash
#!/bin/bash
# .git/hooks/commit-msg

commit_msg=$(cat "$1")

# Check conventional commit format
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|perf|test|chore|ci|revert)(\(.+\))?: .+"; then
  echo "❌ Commit message must follow Conventional Commits format:"
  echo "   <type>(<scope>): <subject>"
  echo ""
  echo "   Examples:"
  echo "   - feat: add login page"
  echo "   - fix(api): correct user validation"
  echo "   - docs: update README"
  exit 1
fi

echo "✅ Commit message format is valid"
```

### Usando Husky

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
npm run type-check
npm run test
```

## Tags e Releases

### Semantic Versioning

```
MAJOR.MINOR.PATCH

1.0.0 - Initial release
1.1.0 - New feature (backwards compatible)
1.1.1 - Bug fix (backwards compatible)
2.0.0 - Breaking change
```

### Criar Tag

```bash
# Tag anotada (recomendado)
git tag -a v1.0.0 -m "Release version 1.0.0

- Add user authentication
- Add workout plan generation
- Add meal tracking
- Add progress visualization"

# Push tag
git push origin v1.0.0

# Push todas as tags
git push origin --tags
```

### Changelog

```markdown
# Changelog

## [1.1.0] - 2024-02-07

### Added
- User profile page with edit functionality
- Progress photo upload and comparison
- Weekly statistics dashboard

### Changed
- Improved workout plan generation algorithm
- Updated UI components to match new design system

### Fixed
- Fix workout log date timezone issue
- Correct meal plan calorie calculation

### Security
- Update dependencies to fix security vulnerabilities

## [1.0.0] - 2024-01-15

### Added
- Initial release
- User authentication with JWT
- Workout plan generation with AI
- Meal plan generation
- Progress tracking
```

## Reverter Mudanças

```bash
# Reverter último commit (mantém mudanças em working directory)
git reset --soft HEAD~1

# Reverter último commit (descarta mudanças)
git reset --hard HEAD~1

# Reverter commit específico (cria novo commit)
git revert <commit-hash>

# Reverter merge
git revert -m 1 <merge-commit-hash>
```

## Boas Práticas

### Do's ✅

- Fazer commits pequenos e atômicos
- Escrever mensagens de commit claras e descritivas
- Fazer rebase/merge com main frequentemente
- Revisar próprio código antes de push
- Usar branches para features/fixes
- Deletar branches após merge
- Usar conventional commits
- Testar antes de commit
- Fazer pull antes de push

### Don'ts ❌

- Commitar código que não compila
- Commitar código sem testes
- Fazer commits gigantes (> 500 linhas)
- Usar mensagens vagas ("fix", "update")
- Commitar arquivos de configuração local
- Commitar credenciais ou secrets
- Force push em branches compartilhadas
- Fazer merge sem review
- Trabalhar diretamente na main

## Checklist Git

- [ ] Branch nomeada corretamente (feature/*, bugfix/*)
- [ ] Commits seguem conventional commits
- [ ] Commits são atômicos e focados
- [ ] Mensagens de commit são claras
- [ ] Código testado localmente
- [ ] Linter e type-check passando
- [ ] Branch atualizada com main
- [ ] PR criado com descrição completa
- [ ] Self-review realizado
- [ ] Testes incluídos/atualizados
