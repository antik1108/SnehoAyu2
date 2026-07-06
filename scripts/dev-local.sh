#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_ENV="$ROOT_DIR/backend/.env"
BACKEND_PID=""
FRONTEND_PID=""
DB_SERVICE_NAME="${POSTGRES_SERVICE_NAME:-}"
DB_SERVICE_STARTED=""
SHUTDOWN_DB_ON_EXIT="${SHUTDOWN_DB_ON_EXIT:-auto}"
PGHOST="${PGHOST:-localhost}"
PGPORT="${PGPORT:-5432}"

log() {
  printf '\n[local-dev] %s\n' "$*"
}

fail() {
  printf '\n[local-dev] ERROR: %s\n' "$*" >&2
  exit 1
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

stop_pid() {
  local pid="${1:-}"
  local name="$2"

  if [[ -z "$pid" ]]; then
    return
  fi

  if kill -0 "$pid" >/dev/null 2>&1; then
    log "Stopping $name..."
    pkill -TERM -P "$pid" >/dev/null 2>&1 || true
    kill -TERM "$pid" >/dev/null 2>&1 || true
    wait "$pid" >/dev/null 2>&1 || true
  fi
}

cleanup() {
  local exit_code=$?
  trap - EXIT INT TERM

  stop_pid "$FRONTEND_PID" "frontend"
  stop_pid "$BACKEND_PID" "backend"

  if [[ -n "$DB_SERVICE_STARTED" ]]; then
    log "Stopping PostgreSQL service $DB_SERVICE_STARTED..."
    brew services stop "$DB_SERVICE_STARTED" >/dev/null 2>&1 || true
  elif [[ "$SHUTDOWN_DB_ON_EXIT" == "always" && -n "$DB_SERVICE_NAME" ]]; then
    log "Stopping PostgreSQL service $DB_SERVICE_NAME..."
    brew services stop "$DB_SERVICE_NAME" >/dev/null 2>&1 || true
  else
    log "Leaving PostgreSQL running because it was already running before this script."
  fi

  exit "$exit_code"
}

db_ready() {
  pg_isready -h "$PGHOST" -p "$PGPORT" >/dev/null 2>&1
}

detect_postgres_service() {
  if [[ -n "$DB_SERVICE_NAME" ]]; then
    printf '%s\n' "$DB_SERVICE_NAME"
    return 0
  fi

  for service in postgresql@17 postgresql@16 postgresql@15 postgresql@14 postgresql; do
    if brew services list 2>/dev/null | awk '{print $1}' | grep -qx "$service"; then
      printf '%s\n' "$service"
      return 0
    fi
  done

  return 1
}

wait_for_database() {
  local attempts=30

  for ((i = 1; i <= attempts; i++)); do
    if db_ready; then
      log "PostgreSQL is ready on $PGHOST:$PGPORT."
      return 0
    fi

    sleep 1
  done

  fail "PostgreSQL did not become ready on $PGHOST:$PGPORT."
}

parse_db_url() {
  if [[ -f "$BACKEND_ENV" ]]; then
    local db_url
    db_url=$(grep -E '^\s*DATABASE_URL\s*=' "$BACKEND_ENV" | head -n 1 | cut -d= -f2- | tr -d "'\"[:space:]")
    if [[ -n "$db_url" ]]; then
      # Extract host and port using pure bash parameter expansion
      local temp="${db_url##*://}"
      temp="${temp%%/*}"
      temp="${temp%%\?*}"
      local host_port="${temp##*@}"
      
      if [[ "$host_port" == *":"* ]]; then
        PGHOST="${host_port%%:*}"
        PGPORT="${host_port##*:}"
      else
        PGHOST="$host_port"
        PGPORT="5432"
      fi
    fi
  fi
}

is_local_host() {
  local host="$1"
  if [[ -z "$host" || "$host" == "localhost" || "$host" == "127.0.0.1" || "$host" == "0.0.0.0" ]]; then
    return 0
  fi
  return 1
}

start_database() {
  parse_db_url

  if ! is_local_host "$PGHOST"; then
    log "Remote database detected in DATABASE_URL ($PGHOST). Skipping local PostgreSQL service check."
    return 0
  fi

  if ! command_exists pg_isready; then
    log "WARNING: pg_isready was not found. Cannot verify if local PostgreSQL is running. Proceeding anyway..."
    return 0
  fi

  if db_ready; then
    log "PostgreSQL is already running on $PGHOST:$PGPORT."
    if [[ "$SHUTDOWN_DB_ON_EXIT" == "always" && -z "$DB_SERVICE_NAME" ]] && command_exists brew; then
      DB_SERVICE_NAME="$(detect_postgres_service || true)"
    fi
    return 0
  fi

  if ! command_exists brew; then
    fail "PostgreSQL is not running on localhost, and Homebrew was not found to start it. Please start PostgreSQL manually."
  fi

  local service
  service="$(detect_postgres_service || true)"

  if [[ -z "$service" ]]; then
    fail "Could not find a Homebrew PostgreSQL service. Set POSTGRES_SERVICE_NAME=postgresql@XX and rerun."
  fi

  DB_SERVICE_NAME="$service"
  log "Starting PostgreSQL service $service..."
  brew services start "$service" >/dev/null
  DB_SERVICE_STARTED="$service"
  wait_for_database
}

wait_for_dev_processes() {
  while true; do
    if [[ -n "$BACKEND_PID" ]] && ! kill -0 "$BACKEND_PID" >/dev/null 2>&1; then
      wait "$BACKEND_PID"
      return $?
    fi

    if [[ -n "$FRONTEND_PID" ]] && ! kill -0 "$FRONTEND_PID" >/dev/null 2>&1; then
      wait "$FRONTEND_PID"
      return $?
    fi

    sleep 2
  done
}

main() {
  cd "$ROOT_DIR"

  [[ -f "$BACKEND_ENV" ]] || fail "Missing backend/.env. Create it before starting local dev."
  command_exists npm || fail "npm was not found."

  if [[ ! -d "$ROOT_DIR/node_modules" ]]; then
    log "Root node_modules was not found. Run npm install if startup fails because dependencies are missing."
  fi

  trap cleanup EXIT INT TERM

  start_database

  log "Applying Prisma migrations..."
  npx -w backend prisma migrate deploy

  log "Generating Prisma client..."
  npx -w backend prisma generate

  log "Starting backend at http://localhost:4000 ..."
  npm run dev -w backend &
  BACKEND_PID=$!

  sleep 2

  log "Starting frontend at http://localhost:5173 ..."
  npm run dev -w frontend -- --host 127.0.0.1 &
  FRONTEND_PID=$!

  cat <<'INFO'

[local-dev] Ready when both servers finish booting:
[local-dev]   Frontend:       http://localhost:5173
[local-dev]   Backend health: http://localhost:4000/api/health
[local-dev]
[local-dev] Press Ctrl+C to stop frontend/backend. PostgreSQL will be stopped too if this script started it.
[local-dev] To also stop a DB that was already running, start with:
[local-dev]   SHUTDOWN_DB_ON_EXIT=always npm run dev:local

INFO

  wait_for_dev_processes
}

main "$@"
