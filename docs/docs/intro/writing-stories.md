---
sidebar_position: 4
---

# Writing stories

A story captures the rendered state of a UI component. It's an object with annotations that describe the component's behavior and appearance given a set of arguments.

Storybook uses the generic term arguments (args for short) when talking about React’s props, Vue’s props, Angular’s @Input, and other similar concepts.

## Where to put stories

A component’s stories are defined in a story file that lives alongside the component file. The story file is for development-only, and it won't be included in your production bundle. In your filesystem, it looks something like this:

```
components/
├─ Button/
│  ├─ Button.tsx
│  ├─ Button.stories.tsx
```

## Component Story Format

We define stories according to the Component Story Format (CSF), an ES6 module-based standard that is easy to write and portable between tools.

The key ingredients are the default export that describes the component, and named exports that describe the stories.

### Default export

The default export metadata controls how Storybook lists your stories and provides information used by addons. For example, here’s the default export for a story file `Button.stories.tsx`:

```tsx
// Button.stories.tsx
import type { Meta } from '@storybook/react-native';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
```

### Defining stories

Use the named exports of a CSF file to define your component’s stories. We recommend you use UpperCamelCase for your story exports. Here’s how to render Button in the “primary” state and export a story called Primary.

```tsx
import type { Meta, StoryObj } from '@storybook/react-native';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};
```

## How to write stories

A story is an object that describes how to render a component. You can have multiple stories per component, and those stories can build upon one another. For example, we can add Secondary and Tertiary stories based on our Primary story from above.

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-native';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    backgroundColor: '#ff0',
    label: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    label: '😄👍😍💯',
  },
};

export const Tertiary: Story = {
  args: {
    ...Primary.args,
    label: '📚📕📈🤓',
  },
};
```

### Using parameters

Parameters are Storybook’s method of defining static metadata for stories. A story’s parameters can be used to provide configuration to various addons at the level of a story or group of stories.

For instance, suppose you wanted to test your Button component against a different set of backgrounds than the other components in your app. You might add a component-level backgrounds parameter:

```tsx
// Button.stories.tsx
import type { Meta } from '@storybook/react';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,

  //👇 Creates specific parameters at the component level
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export default meta;
```

This parameter would instruct the backgrounds addon to reconfigure itself whenever a Button story is selected. Most addons are configured via a parameter-based API and can be influenced at a global, component and story level.

#### UI-related parameters

React Native Storybook provides several built-in parameters to control the on-device UI behavior:

| Parameter               | Type                                         | Description                                                                                                                                       |
| ----------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `noSafeArea`            | `boolean`                                    | When `true`, removes the top safe area padding, allowing your story to render edge-to-edge                                                        |
| `storybookUIVisibility` | `'visible'` \| `'hidden'`                    | Controls the initial visibility of the Storybook UI. When `'hidden'`, the story starts in fullscreen mode                                         |
| `hideFullScreenButton`  | `boolean`                                    | When `true`, hides the fullscreen toggle button                                                                                                   |
| `layout`                | `'padded'` \| `'centered'` \| `'fullscreen'` | Controls the layout of the story container. `'padded'` adds padding, `'centered'` centers the content, `'fullscreen'` removes any default spacing |

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-native';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

// Story that starts with the UI hidden
export const UIHidden: Story = {
  args: {
    label: 'Button',
  },
  parameters: {
    storybookUIVisibility: 'hidden',
  },
};

// Story with centered layout
export const Centered: Story = {
  args: {
    label: 'Button',
  },
  parameters: {
    layout: 'centered',
  },
};

// Story without safe area padding (edge-to-edge)
export const EdgeToEdge: Story = {
  args: {
    label: 'Button',
  },
  parameters: {
    noSafeArea: true,
  },
};
```

### Using decorators

Decorators are a mechanism to wrap a component in arbitrary markup when rendering a story. Components are often created with assumptions about ‘where’ they render. Your styles might expect a theme or layout wrapper, or your UI might expect specific context or data providers.

A simple example is adding padding to a component’s stories. Accomplish this using a decorator that wraps the stories in a div with padding, like so:

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-native';

import { View } from 'react-native';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,

  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        {/* 👇 Decorators in Storybook also accept a function. Replace <Story/> with Story() to enable it */}
        <Story />
      </View>
    ),
  ],
};

export default meta;
```

Decorators can be more complex and are often provided by addons. You can also configure decorators at the story, component and global level.
