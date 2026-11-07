# @storybook/addon-ondevice-backgrounds (deprecated)

> [!WARNING]
> Backgrounds are built into `@storybook/react-native` and enabled by default since v11. This package is a compatibility stub that does nothing. Remove it from your project.

## What the stub does

- `@storybook/addon-ondevice-backgrounds/register` registers nothing. In development it logs one warning asking you to remove the package. The built-in Backgrounds panel stays enabled, so you get exactly one panel.
- `withBackgrounds` renders the story unchanged, so backgrounds aren't applied twice. The built-in panel applies them without a decorator.
- The `Background` type is still exported.

The built-in panel also reads the legacy parameters this addon used (`values` and `default`), so existing stories keep their backgrounds.

## Migrating

1. Remove the addon from `deviceAddons` in `.rnstorybook/main.ts`:

   ```diff
    const main: StorybookConfig = {
      deviceAddons: [
        '@storybook/addon-ondevice-controls',
   -    '@storybook/addon-ondevice-backgrounds',
      ],
    };
   ```

2. Remove `withBackgrounds` from your preview decorators.

3. Uninstall the package:

   ```sh
   npm uninstall @storybook/addon-ondevice-backgrounds
   ```

4. Optionally move from `values` and `default` to `options` and `initialGlobals`, the same format Storybook web uses:

   ```diff
    // .rnstorybook/preview.tsx
   -import { withBackgrounds } from '@storybook/addon-ondevice-backgrounds';

    const preview: Preview = {
   -  decorators: [withBackgrounds],
      parameters: {
        backgrounds: {
   -      default: 'plain',
   -      values: [
   -        { name: 'plain', value: 'white' },
   -        { name: 'dark', value: '#333' },
   -      ],
   +      options: {
   +        plain: { name: 'Plain', value: 'white' },
   +        dark: { name: 'Dark', value: '#333' },
   +      },
        },
      },
   +  initialGlobals: {
   +    backgrounds: { value: 'plain' },
   +  },
    };
   ```

   A story-level `default` becomes `globals: { backgrounds: { value: 'dark' } }` on that story, which also locks the panel for it.

Until you migrate, legacy `values` are keyed by their `name`, and `default` (or the first value when there's no default) is applied while no `backgrounds` global is set.

To turn the built-in panel off, set `features: { ondeviceBackgrounds: false }` in `.rnstorybook/main.ts`.

See the [Backgrounds guide](https://storybookjs.github.io/react-native/docs/intro/configuration/backgrounds) for the full documentation.
