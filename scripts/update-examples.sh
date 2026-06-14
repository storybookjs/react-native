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

cd "$REPO_ROOT"
pnpm build
# pnpm --dir examples/expo-example ios
# pnpm --dir examples/expo-new-wrapper-example storybook:ios
# pnpm --dir examples/expo-router-example storybook:ios
# pnpm --dir examples/repack-example pods && pnpm --dir examples/repack-example ios
