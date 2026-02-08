#!/bin/bash

# FitLife - Stop Script
# This script stops all running FitLife applications

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Emojis
CHECK="${GREEN}✅${NC}"
CROSS="${RED}❌${NC}"
WARN="${YELLOW}⚠️${NC}"

echo ""
echo "🛑 Stopping FitLife applications..."
echo ""

# Check if PID file exists
if [ ! -f ".fitlife-pids" ]; then
    echo -e "${WARN} No running applications found (.fitlife-pids not found)"
    echo ""
    echo "Stopping Docker services..."
    docker-compose down
    echo -e "${CHECK} Docker services stopped"
    exit 0
fi

# Read PIDs
PIDS_DATA=$(cat .fitlife-pids)

# Stop each application
for entry in $PIDS_DATA; do
    PID=$(echo $entry | cut -d':' -f1)
    APP=$(echo $entry | cut -d':' -f2)
    
    if ps -p $PID > /dev/null 2>&1; then
        echo "Stopping $APP (PID: $PID)..."
        kill $PID 2>/dev/null
        
        # Wait for process to stop
        for i in {1..10}; do
            if ! ps -p $PID > /dev/null 2>&1; then
                break
            fi
            sleep 0.5
        done
        
        # Force kill if still running
        if ps -p $PID > /dev/null 2>&1; then
            echo "  Force stopping $APP..."
            kill -9 $PID 2>/dev/null
        fi
        
        echo -e "${CHECK} $APP stopped"
    else
        echo -e "${WARN} $APP (PID: $PID) not running"
    fi
done

# Remove PID file
rm -f .fitlife-pids

echo ""
echo "Stopping Docker services..."
docker-compose down

echo ""
echo -e "${CHECK} All services stopped"
echo ""
