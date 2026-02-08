#!/bin/bash

# FitLife - Complete Setup Script
# This script sets up the entire FitLife development environment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Emojis
CHECK="${GREEN}✅${NC}"
CROSS="${RED}❌${NC}"
WARN="${YELLOW}⚠️${NC}"
INFO="${BLUE}ℹ️${NC}"

# Parse command line arguments
CLEAN_MODE=false
NON_INTERACTIVE=false
RUN_API=false
RUN_WEB=false
RUN_MOBILE=false

show_help() {
  echo "FitLife Setup Script"
  echo ""
  echo "Usage: ./setup.sh [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  --clean        Clean previous setup (remove node_modules, .env files)"
  echo "  --api          Run API server (non-interactive)"
  echo "  --web          Run Web app (non-interactive)"
  echo "  --mobile       Run Mobile app (non-interactive)"
  echo "  --help         Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./setup.sh                    # Interactive menu"
  echo "  ./setup.sh --api --web        # Run API and Web"
  echo "  ./setup.sh --clean --api      # Clean and run only API"
  echo ""
  exit 0
}

while [[ $# -gt 0 ]]; do
  case $1 in
    --help|-h)
      show_help
      ;;
    --clean)
      CLEAN_MODE=true
      shift
      ;;
    --api)
      NON_INTERACTIVE=true
      RUN_API=true
      shift
      ;;
    --web)
      NON_INTERACTIVE=true
      RUN_WEB=true
      shift
      ;;
    --mobile)
      NON_INTERACTIVE=true
      RUN_MOBILE=true
      shift
      ;;
    *)
      echo -e "${CROSS} Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Trap to cleanup on CTRL+C
trap 'echo -e "\n${WARN} Setup interrupted by user"; exit 130' INT

echo ""
echo "╔════════════════════════════════════════╗"
echo "║     🏋️  FitLife Setup Wizard 🏋️      ║"
echo "╔════════════════════════════════════════╗"
echo ""

# ============================================
# 1. VALIDATIONS
# ============================================

echo -e "${INFO} Validating prerequisites..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${CROSS} Node.js is not installed"
    echo "   Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${CROSS} Node.js version must be 20 or higher (current: $(node -v))"
    exit 1
fi
echo -e "${CHECK} Node.js $(node -v)"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo -e "${CROSS} pnpm is not installed"
    echo "   Installing pnpm globally..."
    npm install -g pnpm
fi

PNPM_VERSION=$(pnpm -v | cut -d'.' -f1)
if [ "$PNPM_VERSION" -lt 8 ]; then
    echo -e "${CROSS} pnpm version must be 8 or higher (current: $(pnpm -v))"
    echo "   Updating pnpm..."
    npm install -g pnpm@latest
fi
echo -e "${CHECK} pnpm $(pnpm -v)"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${CROSS} Docker is not installed"
    echo "   Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${CROSS} Docker is not running"
    echo "   Please start Docker Desktop and try again"
    exit 1
fi
echo -e "${CHECK} Docker $(docker -v | cut -d' ' -f3 | sed 's/,//')"

echo ""

# ============================================
# 2. CLEAN MODE (if requested)
# ============================================

if [ "$CLEAN_MODE" = true ]; then
    echo -e "${WARN} Clean mode enabled - removing previous setup..."
    
    # Stop Docker services
    if docker-compose ps &> /dev/null; then
        echo "   Stopping Docker services..."
        docker-compose down -v &> /dev/null || true
    fi
    
    # Remove node_modules
    if [ -d "node_modules" ]; then
        echo "   Removing node_modules..."
        rm -rf node_modules
    fi
    
    # Remove app node_modules
    for app in apps/api apps/web apps/mobile packages/shared; do
        if [ -d "$app/node_modules" ]; then
            rm -rf "$app/node_modules"
        fi
    done
    
    # Remove .env files
    rm -f .env apps/api/.env apps/web/.env.local apps/mobile/.env
    
    # Remove PID file
    rm -f .fitlife-pids
    
    echo -e "${CHECK} Clean completed"
    echo ""
fi

# ============================================
# 3. INSTALL DEPENDENCIES
# ============================================

if [ ! -d "node_modules" ] || [ "$CLEAN_MODE" = true ]; then
    echo -e "${INFO} Installing dependencies..."
    echo ""
    
    pnpm install
    
    echo ""
    echo -e "${CHECK} Dependencies installed"
else
    echo -e "${CHECK} Dependencies already installed (use --clean to reinstall)"
fi

echo ""

# ============================================
# 4. CREATE .ENV FILES
# ============================================

echo -e "${INFO} Creating environment files..."
echo ""

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Root .env
if [ ! -f ".env" ]; then
    echo "   Creating .env..."
    cat > .env << EOF
# Docker Compose Environment Variables
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
JWT_SECRET=${JWT_SECRET}
EOF
    echo -e "${CHECK} Created .env"
else
    echo -e "${CHECK} .env already exists"
fi

# API .env
if [ ! -f "apps/api/.env" ]; then
    echo "   Creating apps/api/.env..."
    cat > apps/api/.env << EOF
# Environment
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fitlife

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# AI Providers (optional for development)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Storage (optional for development)
STORAGE_PROVIDER=local
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=fitlife-uploads

# Frontend URLs
WEB_URL=http://localhost:5173
MOBILE_APP_SCHEME=fitlife://

# Monitoring (optional)
SENTRY_DSN=
EOF
    echo -e "${CHECK} Created apps/api/.env"
else
    echo -e "${CHECK} apps/api/.env already exists"
fi

# Web .env.local
if [ ! -f "apps/web/.env.local" ]; then
    echo "   Creating apps/web/.env.local..."
    cat > apps/web/.env.local << EOF
# API Configuration
VITE_API_URL=http://localhost:3000
EOF
    echo -e "${CHECK} Created apps/web/.env.local"
else
    echo -e "${CHECK} apps/web/.env.local already exists"
fi

# Mobile .env
if [ ! -f "apps/mobile/.env" ]; then
    echo "   Creating apps/mobile/.env..."
    cat > apps/mobile/.env << EOF
# API Configuration
API_URL=http://localhost:3000
EOF
    echo -e "${CHECK} Created apps/mobile/.env"
else
    echo -e "${CHECK} apps/mobile/.env already exists"
fi

echo ""

# ============================================
# 5. DOCKER COMPOSE SETUP
# ============================================

echo -e "${INFO} Starting Docker services..."
echo ""

docker-compose up -d

echo ""
echo -e "${INFO} Waiting for services to be healthy..."

# Wait for services
MAX_WAIT=60
WAIT_TIME=0
while [ $WAIT_TIME -lt $MAX_WAIT ]; do
    POSTGRES_HEALTHY=$(docker-compose ps postgres | grep "healthy" || echo "")
    REDIS_HEALTHY=$(docker-compose ps redis | grep "healthy" || echo "")
    
    if [ -n "$POSTGRES_HEALTHY" ] && [ -n "$REDIS_HEALTHY" ]; then
        break
    fi
    
    sleep 2
    WAIT_TIME=$((WAIT_TIME + 2))
    echo -n "."
done

echo ""

if [ $WAIT_TIME -ge $MAX_WAIT ]; then
    echo -e "${CROSS} Services did not become healthy in time"
    echo "   Check logs with: docker-compose logs"
    exit 1
fi

echo -e "${CHECK} PostgreSQL ready"
echo -e "${CHECK} Redis ready"
echo ""

# ============================================
# 6. PRISMA DATABASE SETUP
# ============================================

echo -e "${INFO} Setting up database..."
echo ""

cd apps/api

# Generate Prisma Client
echo "   Generating Prisma Client..."
pnpm db:generate > /dev/null 2>&1
echo -e "${CHECK} Prisma Client generated"

# Run migrations
echo "   Running migrations..."
pnpm db:migrate > /dev/null 2>&1 || true
echo -e "${CHECK} Migrations applied"

# Ask about seeding
if [ "$NON_INTERACTIVE" = false ]; then
    read -p "   Do you want to seed the database with sample data? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -f "prisma/seed.ts" ]; then
            echo "   Seeding database..."
            pnpm db:seed
            echo -e "${CHECK} Database seeded"
        else
            echo -e "${WARN} Seed file not found, skipping"
        fi
    fi
fi

cd ../..

echo ""

# ============================================
# 7. MENU FOR RUNNING APPLICATIONS
# ============================================

# Check ports in use
check_port() {
    lsof -i:$1 &> /dev/null
    return $?
}

if check_port 3000; then
    echo -e "${WARN} Port 3000 is already in use (API)"
fi

if check_port 5173; then
    echo -e "${WARN} Port 5173 is already in use (Web)"
fi

if check_port 8081; then
    echo -e "${WARN} Port 8081 is already in use (Mobile Metro)"
fi

echo ""

# Remove old PID file
rm -f .fitlife-pids

# Interactive menu
if [ "$NON_INTERACTIVE" = false ]; then
    echo -e "${INFO} Which applications do you want to run?"
    echo ""
    PS3="Select option (1-7): "
    options=(
        "All (API + Web + Mobile)"
        "API + Web"
        "API + Mobile"
        "Only API"
        "Only Web"
        "Only Mobile"
        "Exit (setup complete, don't run anything)"
    )
    
    select opt in "${options[@]}"; do
        case $REPLY in
            1)
                RUN_API=true
                RUN_WEB=true
                RUN_MOBILE=true
                break
                ;;
            2)
                RUN_API=true
                RUN_WEB=true
                break
                ;;
            3)
                RUN_API=true
                RUN_MOBILE=true
                break
                ;;
            4)
                RUN_API=true
                break
                ;;
            5)
                RUN_WEB=true
                break
                ;;
            6)
                RUN_MOBILE=true
                break
                ;;
            7)
                echo ""
                echo -e "${CHECK} Setup complete! No applications started."
                echo ""
                echo "You can start them manually:"
                echo "  API:    cd apps/api && pnpm dev"
                echo "  Web:    cd apps/web && pnpm dev"
                echo "  Mobile: cd apps/mobile && pnpm start"
                exit 0
                ;;
            *)
                echo "Invalid option"
                ;;
        esac
    done
fi

echo ""

# ============================================
# 8. RUN APPLICATIONS
# ============================================

PIDS=""

if [ "$RUN_API" = true ]; then
    echo -e "${INFO} Starting API..."
    cd apps/api
    pnpm dev > ../../logs/api.log 2>&1 &
    API_PID=$!
    PIDS="$PIDS$API_PID:api "
    cd ../..
    echo -e "${CHECK} API started (PID: $API_PID)"
    
    # Wait for API to be ready
    echo "   Waiting for API to be ready..."
    for i in {1..30}; do
        if curl -s http://localhost:3000/health > /dev/null 2>&1; then
            echo -e "${CHECK} API is responding"
            break
        fi
        sleep 1
    done
fi

if [ "$RUN_WEB" = true ]; then
    echo -e "${INFO} Starting Web..."
    cd apps/web
    pnpm dev > ../../logs/web.log 2>&1 &
    WEB_PID=$!
    PIDS="$PIDS$WEB_PID:web "
    cd ../..
    echo -e "${CHECK} Web started (PID: $WEB_PID)"
fi

if [ "$RUN_MOBILE" = true ]; then
    echo -e "${INFO} Starting Mobile..."
    cd apps/mobile
    pnpm start > ../../logs/mobile.log 2>&1 &
    MOBILE_PID=$!
    PIDS="$PIDS$MOBILE_PID:mobile "
    cd ../..
    echo -e "${CHECK} Mobile started (PID: $MOBILE_PID)"
fi

# Save PIDs
if [ -n "$PIDS" ]; then
    mkdir -p logs
    echo "$PIDS" > .fitlife-pids
fi

echo ""

# ============================================
# 9. SUMMARY
# ============================================

echo ""
echo "╔════════════════════════════════════════╗"
echo "║         🎉 Setup Complete! 🎉         ║"
echo "╔════════════════════════════════════════╗"
echo ""

if [ "$RUN_API" = true ] || [ "$RUN_WEB" = true ] || [ "$RUN_MOBILE" = true ]; then
    echo -e "${GREEN}🚀 Applications Running:${NC}"
    
    if [ "$RUN_API" = true ]; then
        echo -e "   ${CHECK} API:    http://localhost:3000 (PID: $API_PID)"
    fi
    
    if [ "$RUN_WEB" = true ]; then
        echo -e "   ${CHECK} Web:    http://localhost:5173 (PID: $WEB_PID)"
    fi
    
    if [ "$RUN_MOBILE" = true ]; then
        echo -e "   ${CHECK} Mobile: Metro bundler running (PID: $MOBILE_PID)"
    fi
    
    echo ""
fi

echo -e "${BLUE}📦 Docker Services:${NC}"
echo -e "   ${CHECK} PostgreSQL: localhost:5432"
echo -e "   ${CHECK} Redis:      localhost:6379"
echo -e "   ${CHECK} Prisma Studio: http://localhost:5555"
echo ""

if [ -n "$PIDS" ]; then
    echo -e "${YELLOW}📝 Logs:${NC}"
    if [ "$RUN_API" = true ]; then
        echo "   tail -f logs/api.log"
    fi
    if [ "$RUN_WEB" = true ]; then
        echo "   tail -f logs/web.log"
    fi
    if [ "$RUN_MOBILE" = true ]; then
        echo "   tail -f logs/mobile.log"
    fi
    echo ""
    
    echo -e "${RED}🛑 To stop all services:${NC}"
    echo "   ./stop.sh"
    echo ""
fi

echo -e "${GREEN}Happy coding! 💻${NC}"
echo ""
