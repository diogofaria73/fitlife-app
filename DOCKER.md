# 🐳 Docker Setup - FitLife

Configuração Docker para desenvolvimento e produção do FitLife.

## 📋 Pré-requisitos

- Docker Desktop instalado ([Download](https://www.docker.com/products/docker-desktop))
- Docker Compose v2.0+

## 🚀 Quick Start (Desenvolvimento)

### 1. Iniciar todos os serviços

```bash
# Na raiz do projeto
docker-compose up -d
```

Isso irá iniciar:
- ✅ PostgreSQL 16 (porta 5432)
- ✅ Redis 7 (porta 6379)
- ✅ API Backend (porta 3000)
- ✅ Prisma Studio (porta 5555)

### 2. Verificar status

```bash
docker-compose ps
```

Você deve ver todos os serviços como "healthy" ou "running":
```
NAME                    STATUS              PORTS
fitlife-postgres        Up (healthy)        0.0.0.0:5432->5432/tcp
fitlife-redis           Up (healthy)        0.0.0.0:6379->6379/tcp
fitlife-api             Up                  0.0.0.0:3000->3000/tcp
fitlife-prisma-studio   Up                  0.0.0.0:5555->5555/tcp
```

### 3. Aplicar migrations

```bash
# Entrar no container da API
docker-compose exec api sh

# Rodar migrations
pnpm db:migrate

# Sair
exit
```

### 4. Acessar serviços

- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **Prisma Studio**: http://localhost:5555

### 5. Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Apenas API
docker-compose logs -f api

# Apenas PostgreSQL
docker-compose logs -f postgres
```

## 🛠️ Comandos Úteis

### Gerenciar Containers

```bash
# Iniciar serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Parar e remover volumes (⚠️ perde dados)
docker-compose down -v

# Reiniciar serviço específico
docker-compose restart api

# Ver logs em tempo real
docker-compose logs -f api
```

### Executar Comandos no Container

```bash
# Shell no container da API
docker-compose exec api sh

# Rodar comando único
docker-compose exec api pnpm test
docker-compose exec api pnpm db:studio
docker-compose exec api pnpm db:generate

# Acessar PostgreSQL
docker-compose exec postgres psql -U postgres -d fitlife
```

### Database Management

```bash
# Aplicar migrations
docker-compose exec api pnpm db:migrate

# Gerar Prisma Client
docker-compose exec api pnpm db:generate

# Seed database
docker-compose exec api pnpm db:seed

# Prisma Studio (já rodando na porta 5555)
# Ou manualmente:
docker-compose exec api pnpm db:studio
```

### Rebuild

```bash
# Rebuild API sem cache
docker-compose build --no-cache api

# Rebuild e reiniciar
docker-compose up -d --build api
```

## 🏭 Produção

### Setup

```bash
# Copiar e configurar env vars
cp .env.docker.example .env.docker

# Editar .env.docker com valores de produção
nano .env.docker
```

### Iniciar em produção

```bash
# Usar docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d

# Verificar status
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Deploy para Registry

```bash
# Build imagem de produção
docker build -t fitlife-api:latest -f apps/api/Dockerfile .

# Tag para registry
docker tag fitlife-api:latest ghcr.io/diogofaria73/fitlife-api:latest

# Push para GitHub Container Registry
docker push ghcr.io/diogofaria73/fitlife-api:latest
```

## 🔧 Configuração Avançada

### Variables de Ambiente

Criar `.env.docker` baseado em `.env.docker.example`:

```env
POSTGRES_USER=fitlife_user
POSTGRES_PASSWORD=strong-password-here
POSTGRES_DB=fitlife_prod
REDIS_PASSWORD=redis-password-here
JWT_SECRET=very-strong-jwt-secret-32-chars-minimum
ANTHROPIC_API_KEY=sk-ant-your-key
OPENAI_API_KEY=sk-your-key
```

### Volumes Personalizados

Para backup/restore de dados:

```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump -U postgres fitlife > backup.sql

# Restore
cat backup.sql | docker-compose exec -T postgres psql -U postgres fitlife
```

### Network Customization

Se precisar conectar outros serviços:

```yaml
services:
  my-service:
    networks:
      - fitlife-network
```

## 🐛 Troubleshooting

### ❌ Container não inicia

```bash
# Ver logs detalhados
docker-compose logs api

# Rebuild sem cache
docker-compose build --no-cache api
docker-compose up -d api
```

### ❌ Erro de conexão com database

```bash
# Verificar se PostgreSQL está saudável
docker-compose ps postgres

# Verificar logs do PostgreSQL
docker-compose logs postgres

# Testar conexão manualmente
docker-compose exec postgres psql -U postgres -c "SELECT 1"
```

### ❌ Porta já em uso

```bash
# Encontrar processo usando a porta
lsof -ti:3000

# Matar processo
kill -9 $(lsof -ti:3000)

# Ou mudar porta no docker-compose.yml
ports:
  - '3001:3000'  # Externa:Interna
```

### ❌ Volumes com dados antigos

```bash
# Parar containers
docker-compose down

# Remover volumes
docker volume rm fitlife-app_postgres_data
docker volume rm fitlife-app_redis_data

# Ou usar flag -v
docker-compose down -v

# Reiniciar
docker-compose up -d
```

## 📊 Recursos dos Containers

### Limites de Memória/CPU (Produção)

Adicione ao `docker-compose.prod.yml`:

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

### Monitoring

```bash
# Ver uso de recursos
docker stats

# Ver apenas API
docker stats fitlife-api
```

## 🔐 Segurança

### Produção Checklist

- [ ] Usar senhas fortes para PostgreSQL e Redis
- [ ] JWT_SECRET com 32+ caracteres aleatórios
- [ ] Não expor Prisma Studio em produção
- [ ] Usar HTTPS/TLS
- [ ] Configurar firewall
- [ ] Limitar rate limiting
- [ ] Configurar backups automáticos
- [ ] Monitoring e alertas

### Gerar Secrets

```bash
# JWT Secret
openssl rand -base64 32

# PostgreSQL Password
openssl rand -base64 24

# Redis Password
openssl rand -base64 24
```

## 📝 Scripts Úteis

### Desenvolvimento Completo

```bash
# Iniciar tudo
docker-compose up -d

# Setup inicial (primeira vez)
docker-compose exec api pnpm db:generate
docker-compose exec api pnpm db:migrate
docker-compose exec api pnpm db:seed

# Desenvolvimento com hot reload
# (volumes montados automaticamente)
```

### Cleanup

```bash
# Parar tudo
docker-compose down

# Remover tudo (incluindo volumes)
docker-compose down -v

# Limpar imagens não usadas
docker image prune -a
```

## 🎯 Vantagens do Docker

✅ **Ambiente consistente** - Mesma versão de PostgreSQL, Redis, Node  
✅ **Setup rápido** - `docker-compose up -d` e pronto  
✅ **Isolamento** - Não polui sua máquina local  
✅ **Fácil reset** - `docker-compose down -v` limpa tudo  
✅ **CI/CD ready** - Mesma config em dev e produção  
✅ **Multi-developer** - Todos usam mesmo ambiente  

## 📚 Recursos

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis)

---

**Pronto para desenvolvimento com Docker!** 🐳
