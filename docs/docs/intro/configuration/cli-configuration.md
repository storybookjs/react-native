---
sidebar_position: 5
---

# CLI Configuration

:::info[You probably don't need this]
If you're using the `withStorybook` bundler wrapper (the recommended setup), the `storybook.requires.ts` file is generated and updated automatically every time your bundler starts. You don't need to run any CLI commands for story generation.

The `sb-rn-get-stories` command documented here is only needed if you've chosen **not** to use a `withStorybook` wrapper at all — for example, in a fully custom build pipeline.
:::

React Native Storybook provides the `sb-rn-get-stories` CLI command for manual story generation. The CLI is included when you install `@storybook/react-native`.

## `sb-rn-get-stories`

Generates the `storybook.requires.ts` file that imports all your stories and configurations.

#### Basic Usage

```sh
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

```sh
# Custom config location
npx sb-rn-get-stories --config-path ./.storybook
npx sb-rn-get-stories -c ./src/storybook
```

##### `--use-js, -js`

Generate JavaScript files instead of TypeScript.

- **Default**: `false` (generates TypeScript)
- **Type**: boolean

```sh
# Generate storybook.requires.js instead of .ts
npx sb-rn-get-stories --use-js
npx sb-rn-get-stories -js

# Useful for non-TypeScript projects
```

##### `--no-doc-tools, -D`

Exclude documentation tools from the generated file.

- **Default**: includes doc tools
- **Type**: boolean

```sh
# Exclude doc tools to reduce bundle size
npx sb-rn-get-stories --no-doc-tools
npx sb-rn-get-stories -D
```

**When to use**: Disable when not using automatic arg extraction with `babel-plugin-react-docgen-typescript`.

##### `--help, -h`

Display help information.

```sh
npx sb-rn-get-stories --help
npx sb-rn-get-stories -h
```

#### Complete Example

```sh
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

```ts
import type { StorybookConfig } from '@storybook/react-native';

const main: StorybookConfig = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  deviceAddons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
};

export default main;
```

#### `preview.tsx` (or `preview.js`)

Global decorators and parameters:

```ts
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

## CLI usage requirements

### With a `withStorybook` wrapper (you don't need the CLI)

Both the bundler-agnostic wrapper (`@storybook/react-native/withStorybook`) and the Metro-specific wrapper (`@storybook/react-native/metro/withStorybook`) automatically generate and update `storybook.requires.ts` on every bundler start. If you're using either wrapper, you can skip the CLI entirely.

If you've customized `configPath` or `useJs` in your wrapper, the generated file will respect those options automatically.

### Without a wrapper (you need the CLI)

If you're not using a `withStorybook` wrapper — for example, in a fully custom build pipeline — run `sb-rn-get-stories` manually whenever you add, remove, or rename story files:

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

```sh
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

```sh
npx sb-rn-get-stories
# Doc tools included by default
```

### When to Disable Doc Tools

Disable doc tools to reduce bundle size when:

- Not using TypeScript
- Not using automatic controls
- Manually defining all argTypes

```sh
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

```sh
# Verify path exists
ls -la ./.rnstorybook
```

2. **Check story patterns**:

```ts
// main.ts - ensure patterns match your file structure
stories: [
  '../components/**/*.stories.tsx', // More specific
  '../**/*.stories.@(js|jsx|ts|tsx)', // Alternative syntax
];
```

3. **Clear Metro cache**:

```sh
npx react-native start --reset-cache
```

### Generated File Issues

1. **TypeScript errors**: Use `--use-js` for JavaScript projects
2. **Import errors**: Ensure all story files match the patterns
3. **Missing addons**: Verify addons are installed and listed in `main.ts`

## Best Practices

1. **Add to git**: Commit the generated `storybook.requires.ts` file
2. **Consistent configuration**: If you use the CLI alongside a `withStorybook` wrapper, ensure the CLI options match the wrapper options (`configPath`, `useJs`, `docTools`)
