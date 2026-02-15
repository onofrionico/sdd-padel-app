#!/bin/sh
set -e

echo "Running database migrations..."
node -r ts-node/register -r tsconfig-paths/register src/database/migrate.ts

echo "Running database seed..."
node -r ts-node/register -r tsconfig-paths/register src/database/run-seed.ts || echo "Seed already executed or failed, continuing..."

echo "Starting application..."
node -r tsconfig-paths/register dist/main
