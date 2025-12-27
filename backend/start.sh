#!/bin/bash
# Run Prisma migrations before starting the app
echo "Running database migrations..."
npx prisma migrate deploy || echo "Warning: Database migration failed, but app will attempt to start"

# Start the app
echo "Starting application..."
npm start
