This file provides guidance to agents when working with code in this repository.

Always check first if the react-native-best-practices skill can be used

## Development Commands

```bash
# Initial Setup
pnpm install
pnpm build

# Development
pnpm dev        # Watch all packages for changes
pnpm example    # Run the expo example app with Storybook

# Story Generation
pnpm -F expo-example storybook-generate # Regenerate storybook.requires.ts

# Testing
pnpm test       # Run unit tests across all packages
pnpm test:ci    # Run tests in CI mode

# Code Quality
pnpm lint       # Run ESLint across the codebase
pnpm format:check   # Check Prettier formatting
pnpm format:fix     # Auto-fix Prettier formatting
```

## On-Device Testing Tools

### agent-device (iOS/Android Simulator Control)

Use `agent-device` to interact with iOS/Android simulators for testing the Storybook app:

```bash
agent-device open host.exp.Exponent --relaunch  # Relaunch Expo Go
agent-device snapshot -c                         # Take accessibility snapshot (shows @refs)
agent-device click @e14                          # Click element by ref from snapshot
agent-device find "Press me" click               # Find text and click it
```

After relaunching, you need to press the app in Expo Go to open it (e.g. click the "Expo Example" entry).

### rn-logs (React Native Log Streaming)

Use `rn-logs` to stream console output from the running app:

```bash
rn-logs apps                              # List running apps
rn-logs logs --app "host.exp.Exponent"    # Stream logs from Expo Go
```

Pipe through `grep` to filter: `rn-logs logs --app "host.exp.Exponent" 2>&1 | grep "KEYWORD"`

## Architecture Overview

**pnpm workspaces monorepo** managed by Lerna containing React Native Storybook packages.

### Key Concepts

1. **CSF (Component Story Format)** - Standard story syntax
2. **On-device UI** - Native UI that runs directly on mobile devices
3. **Story requires generation** - Automatic generation of story imports via Metro (`storybook.requires.ts`)
4. **Portable stories** - Reuse stories in unit tests via `universal-test-renderer`
5. **fn() actions bridge** - `setupFnActionsBridge` in `storybook.requires.ts` bridges `fn()` mocks from `storybook/test` to the on-device actions panel. Must be called from user-land code (not package code) due to module identity — `storybook/test` uses a module-scoped listener Set.

### Build System

- Uses **tsup** for TypeScript compilation (ES2022, CommonJS output)
- Each package has its own `tsup.config.ts`
- `pnpm prepare` in a package builds it (or `pnpm -F @storybook/react-native prepare`)

### Testing

- Uses **jest** with `jest-expo` preset for example app tests
- Story generation snapshots tested with Node's native test runner (`tests/scripts/`)
- Update Node test runner snapshots: `cd tests && node --test-update-snapshots --test scripts/generate.test.ts scripts/docgen.test.ts`
