#!/bin/bash
# CarMarket.ie - Quick Start Script for Linux/Mac

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   CarMarket.ie Quick Start             ║"
echo "║   Car Marketplace for Ireland          ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Project structure not found!"
    echo "Please run this script from: $(pwd)"
    exit 1
fi

echo "✅ Project structure verified"
echo ""

echo "Choose an option:"
echo "1. Install all dependencies"
echo "2. Start frontend only"
echo "3. Start backend only"
echo "4. View setup guide"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "Installing frontend dependencies..."
        cd frontend
        npm install
        cd ..
        echo ""
        echo "Installing backend dependencies..."
        cd backend
        npm install
        cd ..
        echo ""
        echo "✅ Dependencies installed!"
        echo ""
        echo "Next steps:"
        echo "- Terminal 1: cd frontend && npm run dev"
        echo "- Terminal 2: cd backend && npm run dev"
        ;;
    2)
        echo ""
        echo "Starting frontend on http://localhost:3000"
        cd frontend
        npm run dev
        ;;
    3)
        echo ""
        echo "Starting backend on http://localhost:5000"
        cd backend
        npm run dev
        ;;
    4)
        echo ""
        echo "Opening SETUP.md..."
        cat SETUP.md | less
        ;;
    *)
        echo "❌ Invalid choice!"
        ;;
esac
