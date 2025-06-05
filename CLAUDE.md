# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Initial Setup

```bash
yarn install
yarn build
```

### Development

```bash
# Watch all packages for changes
yarn dev

# Run the expo example app with Storybook
yarn example
```

### Testing

```bash
# Run unit tests across all packages
yarn test

# Run tests in CI mode
yarn test:ci

```

### Linting and Code Quality

```bash
# Run ESLint across the codebase
yarn lint
```

### Release Process

```bash
# Version packages (maintainers only)
yarn version-packages

# Publish to npm
yarn publish:latest  # For stable releases
yarn publish:next    # For pre-releases
yarn publish:alpha   # For alpha releases
```

## Architecture Overview

This is a **Yarn workspaces monorepo** managed by Lerna containing React Native Storybook packages:

### Core Packages

- **@storybook/react-native** - Main package providing Storybook functionality for React Native
- **@storybook/react-native-ui** - Full UI components for on-device Storybook
- **@storybook/react-native-ui-lite** - Lightweight UI components
- **@storybook/react-native-ui-common** - Shared UI components
- **@storybook/react-native-theming** - Theming utilities

### On-Device Addons

- **@storybook/addon-ondevice-actions** - Log component interactions
- **@storybook/addon-ondevice-backgrounds** - Change story backgrounds
- **@storybook/addon-ondevice-controls** - Dynamically edit component props
- **@storybook/addon-ondevice-notes** - Add markdown documentation to stories

### Build System

- Uses **tsup** for TypeScript compilation
- Targets ES2022 with CommonJS output
- Each package has its own `tsup.config.ts`
- Running `yarn prepare` in a package builds it

### Metro Configuration

The `withStorybook` wrapper is crucial for React Native Storybook:

- Enables `unstable_allowRequireContext` for dynamic story imports
- Automatically generates `storybook.requires.ts` file
- Optional WebSocket server for remote control
- Can be conditionally enabled/disabled via options

### Key Concepts

1. **CSF (Component Story Format)**: Standard story syntax used across Storybook
2. **On-device UI**: Native UI that runs directly on mobile devices
3. **Story requires generation**: Automatic generation of story imports via Metro
4. **Portable stories**: Reuse stories in unit tests
5. **WebSocket support**: Remote control stories from external devices
