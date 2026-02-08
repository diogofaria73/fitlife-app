# Setup Script - Guia de Uso

Este guia explica como usar os scripts `setup.sh` e `stop.sh` do FitLife.

## 🚀 Setup Rápido

### Primeira Execução

```bash
./setup.sh
```

Ou usando pnpm:

```bash
pnpm setup
```

### O que o script faz?

1. **Valida pré-requisitos**
   - Node.js 20+
   - pnpm 8+
   - Docker instalado e rodando

2. **Instala dependências**
   - `pnpm install` no monorepo completo
   - Instala deps de API, Web, Mobile e Shared

3. **Cria arquivos `.env`**
   - `.env` (root) - Docker Compose vars
   - `apps/api/.env` - Configurações da API
   - `apps/web/.env.local` - URL da API
   - `apps/mobile/.env` - URL da API
   - Gera JWT_SECRET automaticamente

4. **Inicializa Docker**
   - PostgreSQL 16 (porta 5432)
   - Redis 7 (porta 6379)
   - Aguarda serviços ficarem healthy

5. **Configura banco de dados**
   - `pnpm db:generate` - Gera Prisma Client
   - `pnpm db:migrate` - Aplica migrations
   - Opção para fazer seed (dados exemplo)

6. **Menu interativo**
   - Escolha quais apps executar
   - Inicia processos em background
   - Salva PIDs em `.fitlife-pids`

## 📋 Opções do Menu

```
1) Todas (API + Web + Mobile)
2) API + Web
3) API + Mobile
4) Somente API
5) Somente Web
6) Somente Mobile
7) Sair (setup completo, não executar nada)
```

## 🎯 Modo Não-Interativo

Use flags para rodar automaticamente sem menu:

```bash
# Apenas API
./setup.sh --api

# API e Web
./setup.sh --api --web

# Todas as aplicações
./setup.sh --api --web --mobile
```

## 🧹 Modo Limpeza

Para remover setup anterior e começar do zero:

```bash
./setup.sh --clean

# Limpar e rodar API
./setup.sh --clean --api

# Limpar e rodar API + Web
./setup.sh --clean --api --web
```

O que `--clean` remove:
- `node_modules/` (root e apps)
- Arquivos `.env` criados
- Volumes do Docker
- Arquivo `.fitlife-pids`

## 🛑 Parar Aplicações

Para parar todas as aplicações rodando:

```bash
./stop.sh
```

Ou:

```bash
pnpm stop
```

O que `stop.sh` faz:
- Lê PIDs de `.fitlife-pids`
- Para processos Node.js gracefully
- Force kill se necessário
- Para Docker Compose (`docker-compose down`)
- Remove `.fitlife-pids`

## 📍 Serviços e Portas

Após o setup completo:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| API | http://localhost:3000 | Backend REST API |
| API Health | http://localhost:3000/health | Health check endpoint |
| Web | http://localhost:5173 | Frontend React (Vite) |
| Mobile Metro | http://localhost:8081 | React Native bundler |
| PostgreSQL | localhost:5432 | Banco de dados |
| Redis | localhost:6379 | Cache |
| Prisma Studio | http://localhost:5555 | GUI do banco |

## 📝 Logs

Os logs das aplicações ficam em `logs/`:

```bash
# Ver logs da API
tail -f logs/api.log

# Ver logs do Web
tail -f logs/web.log

# Ver logs do Mobile
tail -f logs/mobile.log

# Ver todos os logs
tail -f logs/*.log
```

## 🔧 Troubleshooting

### Porta em uso

Se uma porta já estiver em uso:

```bash
# Descobrir processo usando porta 3000
lsof -ti:3000

# Matar processo
kill -9 $(lsof -ti:3000)
```

### Docker não inicia

```bash
# Verificar se Docker está rodando
docker info

# Iniciar Docker Desktop manualmente
open -a Docker
```

### Dependências faltando

```bash
# Reinstalar tudo
./setup.sh --clean
```

### Banco de dados corrompido

```bash
# Parar tudo
./stop.sh

# Remover volumes Docker
docker-compose down -v

# Refazer setup
./setup.sh
```

### Script com erro de permissão

```bash
# Dar permissão de execução
chmod +x setup.sh stop.sh
```

## 🎨 Recursos do Script

- ✅ **Cores no terminal** - Verde (sucesso), Vermelho (erro), Amarelo (aviso)
- ✅ **Validação de portas** - Avisa se portas já estão em uso
- ✅ **Health check automático** - Verifica se API iniciou corretamente
- ✅ **Trap CTRL+C** - Cleanup ao interromper
- ✅ **Sintaxe bash validada** - Scripts testados
- ✅ **Help integrado** - `./setup.sh --help`

## 📚 Comandos Úteis

```bash
# Ver help
./setup.sh --help

# Setup interativo
./setup.sh

# Setup rápido (API + Web)
./setup.sh --api --web

# Limpar e refazer
./setup.sh --clean

# Parar tudo
./stop.sh

# Ver processos rodando
ps aux | grep node

# Ver containers Docker
docker-compose ps

# Logs Docker
docker-compose logs -f
```

## 🔄 Workflow Diário

```bash
# Manhã - Iniciar ambiente
./setup.sh --api --web

# Durante o dia - Ver logs se necessário
tail -f logs/api.log

# Fim do dia - Parar tudo
./stop.sh
```

## ⚙️ Configuração Avançada

### Customizar .env

Após o primeiro setup, você pode editar os `.env` criados:

```bash
# Adicionar API keys
vim apps/api/.env

# Configurar URL customizada
vim apps/web/.env.local
```

### Múltiplos ambientes

```bash
# Development (padrão)
./setup.sh --api

# Com .env customizado
cp apps/api/.env apps/api/.env.staging
# Editar apps/api/.env.staging
DATABASE_URL=... ./setup.sh --api
```

## 🤝 Contribuindo

Se encontrar problemas ou tiver sugestões:

1. Verifique se os pré-requisitos estão instalados
2. Tente `./setup.sh --clean`
3. Veja os logs em `logs/`
4. Abra uma issue no GitHub

---

**Pronto para começar!** 🚀

Execute `./setup.sh` e comece a desenvolver no FitLife!
