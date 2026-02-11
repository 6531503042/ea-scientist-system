#!/bin/bash

# ==============================================================================
# Docker Runner Script for EA System
# ==============================================================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}   🐳 EA System - Docker Runner   ${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""
echo "Select an option:"
echo "1) Run EVERYTHING (App + Database + pgAdmin)"
echo "2) Run Database ONLY"
echo "3) Run App ONLY (Requires external DB or running DB)"
echo "4) Build App Image (No cache)"
echo "5) Stop All Containers"
echo "6) View Logs"
echo "7) Fresh Start (Rebuild ALL + Reset DB + Seed)"
echo "exit) Exit"
echo ""
read -p "Enter choice: " choice

case $choice in
    1)
        echo -e "${GREEN}Starting Full Stack...${NC}"
        docker compose -f docker-compose.yml up -d
        echo -e "${GREEN}Done! App running at http://localhost:3000${NC}"
        ;;
    2)
        echo -e "${GREEN}Starting Database...${NC}"
        docker compose -f docker-compose.db.yml up -d
        echo -e "${GREEN}Done! Database running on port 5432${NC}"
        ;;
    3)
        echo -e "${GREEN}Starting App Only...${NC}"
        docker compose -f docker-compose.app.yml up -d
        echo -e "${GREEN}Done! App running at http://localhost:3000${NC}"
        ;;
    4)
        echo -e "${YELLOW}Building App Image...${NC}"
        docker compose -f docker-compose.yml build --no-cache app
        echo -e "${GREEN}Build Complete!${NC}"
        ;;
    5)
        echo -e "${RED}Stopping all containers...${NC}"
        docker compose -f docker-compose.yml down
        docker compose -f docker-compose.app.yml down
        docker compose -f docker-compose.db.yml down
        echo -e "${GREEN}All stopped.${NC}"
        ;;
    6)
        echo -e "${BLUE}Streaming logs... (Ctrl+C to exit)${NC}"
        docker compose -f docker-compose.yml logs -f
        ;;
    7)
        echo -e "${YELLOW}=== Fresh Start: Rebuilding everything from scratch ===${NC}"
        echo -e "${RED}Stopping and removing all containers, volumes...${NC}"
        docker compose -f docker-compose.yml down -v
        echo ""
        echo -e "${YELLOW}Rebuilding ALL images (no cache)...${NC}"
        docker compose -f docker-compose.yml build --no-cache
        echo ""
        echo -e "${GREEN}Starting Fresh Stack (DB + Migration + Seed + App)...${NC}"
        docker compose -f docker-compose.yml up -d
        echo ""
        echo -e "${BLUE}Waiting for services to initialize...${NC}"
        sleep 5
        echo -e "${BLUE}Migration & Seed logs:${NC}"
        docker compose logs migrate
        echo ""
        echo -e "${GREEN}=================================================${NC}"
        echo -e "${GREEN}  Fresh Start Complete!${NC}"
        echo -e "${GREEN}  App:     http://localhost:3000${NC}"
        echo -e "${GREEN}  pgAdmin: http://localhost:5050${NC}"
        echo -e "${GREEN}=================================================${NC}"
        echo -e "${BLUE}Test accounts (password: password123):${NC}"
        echo "  admin@dss.go.th       → Admin"
        echo "  somchai@dss.go.th     → Architect"
        echo "  director@dss.go.th    → Executive"
        echo "  suree@dss.go.th       → User"
        ;;
    exit)
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid option.${NC}"
        ;;
esac
