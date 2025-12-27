#!/bin/bash
# Ensure database schema is up to date
echo "Syncing database schema..."
npx prisma db push --skip-generate || echo "Warning: Database sync failed, but app will attempt to start"

# Start the app
echo "Starting application..."
npm start
