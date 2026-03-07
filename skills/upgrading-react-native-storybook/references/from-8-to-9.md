# From 8.x to 9.x

Use this only when the project is already on Storybook React Native `8.x`.

## Main Changes

- Upgrade Storybook packages to `9.x`
- Rename the config folder from `.storybook/` to `.rnstorybook/`
- Regenerate `storybook.requires.ts` in the new folder

Do not also apply the `9 -> 10` changes during this step.

## Dependencies

Update Storybook dependencies to `9.x`, keeping the package family aligned:

- `storybook`
- `@storybook/react-native`
- `@storybook/addon-ondevice-actions`
- `@storybook/addon-ondevice-backgrounds`
- `@storybook/addon-ondevice-controls`
- `@storybook/addon-ondevice-notes`

If the repo also uses `@storybook/react`, align that package to the same major.

Example `package.json` shape after the upgrade:

```json
{
  "devDependencies": {
    "storybook": "^9.1.4",
    "@storybook/react": "^9.1.4",
    "@storybook/react-native": "^9.1.4",
    "@storybook/addon-ondevice-actions": "^9.1.4",
    "@storybook/addon-ondevice-backgrounds": "^9.1.4",
    "@storybook/addon-ondevice-controls": "^9.1.4",
    "@storybook/addon-ondevice-notes": "^9.1.4"
  }
}
```

## Folder Rename

Rename the React Native Storybook config folder:

- from `.storybook/`
- to `.rnstorybook/`

Then update every path that points at it, including:

- app entry imports
- Metro config `configPath`
- generation scripts
- docs or helper scripts that reference the config directory

Example path updates:

```diff
-import StorybookUI from './.storybook';
+import StorybookUI from './.rnstorybook';
```

```diff
-configPath: path.resolve(__dirname, './.storybook'),
+configPath: path.resolve(__dirname, './.rnstorybook'),
```

```diff
-"storybook-generate": "sb-rn-get-stories -c ./.storybook"
+"storybook-generate": "sb-rn-get-stories -c ./.rnstorybook"
```

## Regenerate

Regenerate `.rnstorybook/storybook.requires.ts` after the rename.

Example command:

```sh
yarn storybook-generate
```

## Verify

- No remaining references to the old `.storybook/` path for React Native Storybook
- The generated requires file now lives under `.rnstorybook/`
- Storybook still boots after the rename
