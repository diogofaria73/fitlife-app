#!/bin/bash

# FitLife - Docker Development Setup Script
# This script helps you get started with Docker quickly

set -e

echo "🐳 FitLife Docker Setup"
echo "======================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first:"
    echo "   https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is installed and running"
echo ""

# Check if .env.docker exists
if [ ! -f .env.docker ]; then
    echo "📝 Creating .env.docker from template..."
    cp .env.docker.example .env.docker
    echo "⚠️  Please edit .env.docker with your configuration (API keys, etc)"
    echo ""
fi

# Start services
echo "🚀 Starting Docker services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service health
echo ""
echo "📊 Service Status:"
docker-compose ps

# Setup database
echo ""
echo "🗄️  Setting up database..."
docker-compose exec -T api sh << 'EOF'
  cd /app/apps/api
  pnpm db:generate
  pnpm db:migrate
  echo "✅ Database setup complete"
EOF

echo ""
echo "🎉 FitLife is ready!"
echo ""
echo "📍 Services:"
echo "   - API:           http://localhost:3000"
echo "   - Health Check:  http://localhost:3000/health"
echo "   - Prisma Studio: http://localhost:5555"
echo "   - PostgreSQL:    localhost:5432"
echo "   - Redis:         localhost:6379"
echo ""
echo "📚 Useful commands:"
echo "   docker-compose logs -f        # View logs"
echo "   docker-compose exec api sh    # Access API container"
echo "   docker-compose down           # Stop all services"
echo ""
echo "For more info, see DOCKER.md"
