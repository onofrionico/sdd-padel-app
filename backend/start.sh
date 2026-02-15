#!/bin/sh
set -e

echo "Running database migrations..."
node -r ts-node/register -r tsconfig-paths/register src/database/migrate.ts

echo "Starting application..."
node -r tsconfig-paths/register dist/main
