#!/usr/bin/env bash
# A statikus oldal buildelése és helyi kiszolgálása, ugyanazok a fájlok, mint amit a GitHub Pages kap.
#
#   ./serve-web.sh              # build, majd szerver a http://localhost:4321/ címen
#   ./serve-web.sh --host       # elérhető a helyi hálózatról is (telefon ugyanazon a Wi-Fi-n)
#   ./serve-web.sh stop         # a háttérben maradt szerver leállítása
#
# Megnyitja a böngészőt (NO_OPEN=1: csak a szerver indul); PORT állítja a portot (4321). Ctrl+C leállítja.
set -euo pipefail

cd "$(dirname "$0")"
PORT="${PORT:-4321}"
HOST_ARGS=()
if [[ "${1:-}" == "--host" ]]; then
  HOST_ARGS=(--host)
  shift
fi
# a stop a --host után is működik (./serve-web.sh --host stop)
if [[ "${1:-}" == "stop" ]]; then
  exec npx astro preview stop
fi

# Node 24 vagy újabb szükséges (package.json: engines)
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
if (( NODE_MAJOR < 24 )); then
  echo "Hiba: Node 24 vagy újabb kell, jelenleg: $(node -v)" >&2
  exit 1
fi

# újratelepítés, ha nincs node_modules, vagy a package-lock.json újabb a node_modules-nál
if [[ ! -d node_modules || package-lock.json -nt node_modules ]]; then
  npm ci
fi
npm run build

URL="http://localhost:$PORT/"
# az astro preview a saját maga is háttérbe mehet, ezért a szkript háttérben indítja és kilépéskor leállítja
if ! npx astro preview --background --port "$PORT" "${HOST_ARGS[@]}"; then
  echo "Hiba: nem indult az astro preview (foglalt port? PORT=... vagy ./serve-web.sh stop)" >&2
  exit 1
fi
trap 'npx astro preview stop >/dev/null 2>&1 || true' EXIT
echo "Oldal: $URL (Ctrl+C leállítja)"
if [[ ${#HOST_ARGS[@]} -gt 0 ]]; then
  for ip in $(hostname -I 2>/dev/null); do
    [[ "$ip" == *:* ]] && continue
    echo "Helyi hálózat: http://$ip:$PORT/"
  done
fi
if [[ -z "${NO_OPEN:-}" ]] && command -v xdg-open >/dev/null; then
  xdg-open "$URL" >/dev/null 2>&1 || true
fi
npx astro preview logs --follow
