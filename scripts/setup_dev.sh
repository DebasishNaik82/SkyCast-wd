#!/bin/bash
# 🌤️ SkyCast Development Initialization Strategy & Health Check
# Useful for setting up workspaces, cleaning cache, and verifying requirements.

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== SkyCast Precision Setup Strategy ===${NC}"

# Check Node version
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Warning: NodeJs is not installed. Please install node before starting.${NC}"
else
    NODE_VER=$(node -v)
    echo -e "${GREEN}✓ Node.js detected:${NC} $NODE_VER"
fi

# Check configuration files
if [ -f "tsconfig.json" ]; then
    echo -e "${GREEN}✓ TypeScript compiler config detected.${NC}"
fi

if [ -f "package.json" ]; then
    echo -e "${GREEN}✓ Node Package Manifest exists.${NC}"
fi

# Execute cleanup strategy
echo -e "${BLUE}Initializing clean cache routine...${NC}"
rm -rf .next/cache

echo -e "${GREEN}System is ready for production compile. Execute 'npm run build' to test production builds.${NC}"
