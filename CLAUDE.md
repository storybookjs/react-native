# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Always check first if the react-native-best-practices skill can be used

## Development Commands

```bash
# Initial Setup
yarn install
yarn build

# Development
yarn dev        # Watch all packages for changes
yarn example    # Run the expo example app with Storybook

# Testing
yarn test       # Run unit tests across all packages
yarn test:ci    # Run tests in CI mode

# Code Quality
yarn lint       # Run ESLint across the codebase
yarn format:check   # Check Prettier formatting
yarn format:fix     # Auto-fix Prettier formatting

# Documentation (from docs/ directory)
cd docs
yarn start      # Start development server
yarn build      # Build documentation
yarn serve      # Serve built documentation
```

## Architecture Overview

**Yarn workspaces monorepo** managed by Lerna containing React Native Storybook packages.

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
- `yarn prepare` in a package builds it

The `withStorybook` Metro wrapper:

- Enables `unstable_allowRequireContext` for dynamic story imports
- Automatically generates `storybook.requires.ts` file
- Optional WebSocket server for remote control
- Can be conditionally enabled/disabled via `enabled` option
- Supports `liteMode` for reduced bundle size

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
