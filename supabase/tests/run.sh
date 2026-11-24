#!/usr/bin/env bash
# Aplica las migraciones en un Postgres desechable (Docker) y ejecuta los tests de seguridad.
# Uso: pnpm test:db
set -euo pipefail
cd "$(dirname "$0")/../.."

NAME="conciencia-test-db-$$"
docker run -d --rm --name "$NAME" -e POSTGRES_PASSWORD=test postgres:16-alpine >/dev/null
trap 'docker stop "$NAME" >/dev/null' EXIT

for _ in $(seq 1 30); do
  docker exec "$NAME" pg_isready -U postgres -q && break
  sleep 1
done
sleep 1

psql() { docker exec -i "$NAME" psql -U postgres -v ON_ERROR_STOP=1 -q "$@"; }

psql < supabase/tests/stub-supabase.sql
for f in supabase/migrations/*.sql; do
  echo "→ $f"
  psql < "$f" 2>&1 | grep -v "pg_cron no está disponible" || true
done
psql < supabase/tests/seguridad.test.sql 2>&1 | sed 's/^NOTICE:  //'
