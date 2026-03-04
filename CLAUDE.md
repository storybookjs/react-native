This file provides guidance to agents when working with code in this repository.

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

# Documentation (from docs/ directory)
cd docs
pnpm start      # Start development server
pnpm build      # Build documentation
pnpm serve      # Serve built documentation
```

## Architecture Overview

**pnpm workspaces monorepo** containing React Native Storybook packages.

### Packages

**Apps**

- examples/expo-example - Expo example app showcasing Storybook
- docs - Documentation site for Storybook React Native

**Core:**

- `@storybook/react-native` - Main package providing Storybook functionality
- `@storybook/react-native-ui` - Full UI components for on-device Storybook
- `@storybook/react-native-ui-lite` - Lightweight UI components
- `@storybook/react-native-ui-common` - Shared UI components
- `@storybook/react-native-theming` - Theming utilities

**On-Device Addons:**

- `@storybook/addon-ondevice-actions` - Log component interactions
- `@storybook/addon-ondevice-backgrounds` - Change story backgrounds
- `@storybook/addon-ondevice-controls` - Dynamically edit component props
- `@storybook/addon-ondevice-notes` - Add markdown documentation to stories

### Build System & Metro Configuration

- Uses **tsup** for TypeScript compilation (ES2022, CommonJS output)
- Each package has its own `tsup.config.ts`
- `pnpm prepare` in a package builds it

The `withStorybook` Metro wrapper (for Metro-based projects):

- Enables `unstable_allowRequireContext` for dynamic story imports
- Automatically generates `storybook.requires.ts` file
- Optional WebSocket server for remote control
- Can be conditionally enabled/disabled via `enabled` option
- Supports `liteMode` for reduced bundle size

The `StorybookPlugin` (for Re.Pack/Rspack/Webpack projects):

- Alternative to `withStorybook` for non-Metro bundlers
- Imported from `@storybook/react-native/repack/withStorybook`
- Requires `enablePackageExports: true` in rspack resolve options
- Uses `DefinePlugin` for build-time `STORYBOOK_ENABLED` constant
- No `require.context` configuration needed (rspack handles it natively)
- Same options as `withStorybook` (enabled, configPath, useJs, docTools, liteMode, websockets)

### Testing

- Uses **jest** with `jest-expo` preset
- `universal-test-renderer` for portable story testing
- Story generation tested with Node's native test runner

### Key Concepts

1. **CSF (Component Story Format)** - Standard story syntax
2. **On-device UI** - Native UI that runs directly on mobile devices
3. **Story requires generation** - Automatic generation of story imports via Metro
4. **Portable stories** - Reuse stories in unit tests
5. **WebSocket support** - Remote control stories from external devices
6. **Lite mode** - Alternative UI without heavy dependencies (reanimated, etc.)
