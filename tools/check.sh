#!/usr/bin/env bash
# Checks: en/hu key check, build (content schemas). The same script runs locally and in CI.
set -u
cd "$(dirname "$0")/.."

failed=()

step() {
  local name=$1
  shift
  echo "== $name"
  if ! "$@"; then failed+=("$name"); fi
}

step "i18n keys" npm run --silent check
step "build" npm run --silent build

if [ "${#failed[@]}" -gt 0 ]; then
  echo "FAILED: ${failed[*]}"
  exit 1
fi
echo "All checks passed."
