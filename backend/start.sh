#!/bin/bash
# Debug: Show environment variables
echo "Environment variables check:"
echo "CLOUDINARY_CLOUD_NAME: ${CLOUDINARY_CLOUD_NAME:-not set}"
echo "CLOUDINARY_API_KEY: ${CLOUDINARY_API_KEY:-not set}"
echo "CLOUDINARY_API_SECRET: ${CLOUDINARY_API_SECRET:-not set}"
echo "DATABASE_URL: ${DATABASE_URL:-not set}"
echo ""

# Ensure database schema is up to date
echo "Syncing database schema..."
npx prisma db push --skip-generate || echo "Warning: Database sync failed, but app will attempt to start"

# Start the app
echo "Starting application..."
npm start
