---
sidebar_position: 5
---

# CLI Configuration

React Native Storybook provides CLI commands to help with setup and story generation. This page covers all available commands and their options.

## Installation

The CLI is included when you install `@storybook/react-native`

## Available Commands

### `sb-rn-get-stories`

Generates the `storybook.requires.ts` file that imports all your stories and configurations.

#### Basic Usage

```bash
# Generate with default options
npx sb-rn-get-stories

# Or add to package.json scripts
{
  "scripts": {
    "storybook-generate": "sb-rn-get-stories"
  }
}
```

#### Command Options

##### `--config-path, -c`

Specify the path to your Storybook configuration folder.

- **Default**: `./.rnstorybook`
- **Type**: string

```bash
# Custom config location
npx sb-rn-get-stories --config-path ./.storybook
npx sb-rn-get-stories -c ./src/storybook
```

##### `--use-js, -js`

Generate JavaScript files instead of TypeScript.

- **Default**: `false` (generates TypeScript)
- **Type**: boolean

```bash
# Generate storybook.requires.js instead of .ts
npx sb-rn-get-stories --use-js
npx sb-rn-get-stories -js

# Useful for non-TypeScript projects
```

##### `--no-doc-tools, -D`

Exclude documentation tools from the generated file.

- **Default**: includes doc tools
- **Type**: boolean

```bash
# Exclude doc tools to reduce bundle size
npx sb-rn-get-stories --no-doc-tools
npx sb-rn-get-stories -D
```

**When to use**: Disable when not using automatic arg extraction with `babel-plugin-react-docgen-typescript`.

##### `--help, -h`

Display help information.

```bash
npx sb-rn-get-stories --help
npx sb-rn-get-stories -h
```

#### Complete Example

```bash
# Generate with all options
npx sb-rn-get-stories \
  --config-path ./src/.storybook \
  --use-js \
  --no-doc-tools
```

## Configuration Files

The CLI looks for these files in your config path:

### Required Files

#### `main.ts` (or `main.js`)

Defines stories location and addons:

```typescript
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

export default main;
```

#### `preview.tsx` (or `preview.js`)

Global decorators and parameters:

```typescript
import { Preview } from '@storybook/react-native';

const preview: Preview = {
  decorators: [
    /* ... */
  ],
  parameters: {
    /* ... */
  },
};

export default preview;
```

### Generated Files

#### `storybook.requires.ts` (or `.js`)

Auto-generated file containing:

- Story imports based on `main.ts` patterns
- Addon registrations
- Preview configurations
- Hot module reloading setup

**Important**: Never edit this file manually - it's regenerated automatically.

## Integration with Build Tools

### Metro Integration

The `withStorybook` Metro wrapper automatically runs story generation:

```js
// metro.config.js
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

module.exports = withStorybook(config, {
  configPath: './.rnstorybook', // Must match CLI --config-path
  useJs: false, // Must match CLI --use-js
});
```

### Manual Integration

For custom build setups, run the CLI before building:

```json
{
  "scripts": {
    "prebuild": "sb-rn-get-stories",
    "build": "react-native build-android"
  }
}
```

## Doc Tools and Automatic Args

### What Are Doc Tools?

Doc tools enable automatic extraction of component props to generate controls. They work with `babel-plugin-react-docgen-typescript`.

### Setup

1. **Install the babel plugin**:

```bash
npm install --save-dev babel-plugin-react-docgen-typescript
```

2. **Configure babel**:

```javascript
// babel.config.js
module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [['babel-plugin-react-docgen-typescript', { exclude: 'node_modules' }]],
};
```

3. **Ensure doc tools are enabled** (default behavior):

```bash
npx sb-rn-get-stories
# Doc tools included by default
```

### When to Disable Doc Tools

Disable doc tools to reduce bundle size when:

- Not using TypeScript
- Not using automatic controls
- Manually defining all argTypes

```bash
npx sb-rn-get-stories --no-doc-tools
```

## Environment-Specific Configuration

### Development vs Production

```json
{
  "scripts": {
    "storybook:dev": "sb-rn-get-stories -c ./.storybook-dev",
    "storybook:prod": "sb-rn-get-stories -c ./.storybook-prod --no-doc-tools"
  }
}
```

## Troubleshooting

### Stories Not Found

1. **Check config path**:

```bash
# Verify path exists
ls -la ./.rnstorybook
```

2. **Check story patterns**:

```typescript
// main.ts - ensure patterns match your file structure
stories: [
  '../components/**/*.stories.tsx', // More specific
  '../**/*.stories.@(js|jsx|ts|tsx)', // Alternative syntax
];
```

3. **Clear Metro cache**:

```bash
npx react-native start --reset-cache
```

### Generated File Issues

1. **TypeScript errors**: Use `--use-js` for JavaScript projects
2. **Import errors**: Ensure all story files match the patterns
3. **Missing addons**: Verify addons are installed and listed in `main.ts`

## Best Practices

1. **Add to git**: Commit the generated `storybook.requires.ts` file
2. **Consistent configuration**: Ensure CLI options match Metro wrapper options:

```js
// metro.config.js
module.exports = withStorybook(config, {
  configPath: './.storybook', // Matches: sb-rn-get-stories -c ./.storybook
  useJs: true, // Matches: sb-rn-get-stories --use-js
});
```
