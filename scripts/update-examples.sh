#!/usr/bin/env sh
set -e

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
REPO_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)

for example in expo-example expo-new-wrapper-example expo-router-example; do
  (
    cd "$REPO_ROOT/examples/$example"
    pnpx expo@latest install expo@latest --fix
  )
done

(
  cd "$REPO_ROOT"
  pnpm repo:fix
)

for example in expo-example expo-new-wrapper-example expo-router-example; do
  (
    cd "$REPO_ROOT/examples/$example"
    pnpx expo prebuild --clean
  )
done
