#!/usr/bin/env bash
# Gera os modelos: Blender sem interface e depois quantização com @gltf-transform.
# Quantização dispensa WASM no navegador, o que preserva a CSP (docs/09).
set -euo pipefail
cd "$(dirname "$0")/../.."
BLENDER="${BLENDER:-$(ls -d "$HOME"/.local/opt/blender-*/blender | sort -V | tail -1)}"
mkdir -p public/gl
for nome in ${*:-nave lancetas relicario}; do
  "$BLENDER" --background --factory-startup --python-exit-code 1 --python "scripts/blender/$nome.py" 2>&1 | grep -E '\[modelo\]|Error|Traceback|error:' || true
  npx gltf-transform dedup "assets-3d/brutos/$nome.glb" "assets-3d/brutos/$nome.d.glb" >/dev/null
  npx gltf-transform quantize "assets-3d/brutos/$nome.d.glb" "public/gl/$nome.glb" --quantize-position 14 --quantize-normal 8 --quantize-color 8 >/dev/null
  rm "assets-3d/brutos/$nome.d.glb"
  ls -la "public/gl/$nome.glb" | awk -v n="$nome" '{printf "%s: %.0f KB, ", n, $5/1024}'
  gzip -c "public/gl/$nome.glb" | wc -c | awk '{printf "%.0f KB gzip\n", $1/1024}'
done
