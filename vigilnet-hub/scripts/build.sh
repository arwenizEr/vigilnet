#!/bin/bash
# Build script that handles Prisma conditionally

if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL found, generating Prisma client..."
  npx prisma generate
else
  echo "DATABASE_URL not set, skipping Prisma generation (caching disabled)"
fi

echo "Building Next.js app..."
next build

