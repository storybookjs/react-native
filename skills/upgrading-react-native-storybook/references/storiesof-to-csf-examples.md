# `storiesOf` to CSF Examples

Use these examples during the `6.5.x -> 7.6.x` migration when converting legacy `storiesOf` files to CSF.
This is the detailed companion reference for the manual conversion checklist in [from-6-5-to-7-6.md](from-6-5-to-7-6.md).

## Contents

- Basic `storiesOf` chain to CSF
- Move decorators and parameters to `meta`
- Replace knobs with `args` and `argTypes`
- Convert inline stateful stories to `render`
- Remove legacy runtime and knobs imports

## Basic `storiesOf` Chain to CSF

Before:

```tsx
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { Button } from './Button';

storiesOf('Button', module)
  .add('primary', () => <Button label="Primary" variant="primary" />)
  .add('secondary', () => <Button label="Secondary" variant="secondary" />);
```

After:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Button',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: 'Primary',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary',
    variant: 'secondary',
  },
};
```

## Move Decorators and Parameters to `meta`

Before:

```tsx
import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { Badge } from './Badge';

storiesOf('Badge', module)
  .addDecorator((Story) => (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Story />
    </View>
  ))
  .addParameters({
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#111' }],
    },
  })
  .add('default', () => <Badge label="New" />)
  .add('success', () => <Badge label="Saved" tone="success" />);
```

After:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Badge } from './Badge';

const meta = {
  title: 'Badge',
  component: Badge,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#111' }],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'New',
  },
};

export const Success: Story = {
  args: {
    label: 'Saved',
    tone: 'success',
  },
};
```

## Replace Knobs With `args` and `argTypes`

Before:

```tsx
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { text, boolean, select } from '@storybook/addon-knobs';
import { withKnobs } from '@storybook/addon-ondevice-knobs';
import { Chip } from './Chip';

storiesOf('Chip', module)
  .addDecorator(withKnobs)
  .add('playground', () => (
    <Chip
      label={text('label', 'Example')}
      selected={boolean('selected', false)}
      tone={select('tone', ['neutral', 'info', 'danger'], 'neutral')}
    />
  ));
```

After:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip';

const meta = {
  title: 'Chip',
  component: Chip,
  argTypes: {
    tone: {
      options: ['neutral', 'info', 'danger'],
      control: { type: 'select' },
    },
    selected: {
      control: { type: 'boolean' },
    },
    label: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    label: 'Example',
    selected: false,
    tone: 'neutral',
  },
};
```

Migration notes:

- remove `withKnobs`
- remove `@storybook/addon-knobs` and `@storybook/addon-ondevice-knobs`
- move default values from knob calls into `args`
- move knob option lists into `argTypes`

## Convert Callbacks and Inline Stateful Stories

Before:

```tsx
import React, { useState } from 'react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { Counter } from './Counter';

storiesOf('Counter', module).add('interactive', () => {
  const [count, setCount] = useState(0);

  return (
    <Counter
      count={count}
      onIncrement={() => {
        action('increment pressed')();
        setCount((current) => current + 1);
      }}
    />
  );
});
```

After:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { useState } from 'react';
import { Counter } from './Counter';

const meta = {
  title: 'Counter',
  component: Counter,
  args: {
    onIncrement: fn(),
  },
} satisfies Meta<typeof Counter>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  render: function InteractiveRender(args) {
    const [count, setCount] = useState(0);

    return (
      <Counter
        {...args}
        count={count}
        onIncrement={() => {
          args.onIncrement();
          setCount((current) => current + 1);
        }}
      />
    );
  },
};
```

Migration notes:

- use a named `render` function when hooks are needed
- prefer `fn()` for callback args instead of `action(...)` in story bodies
- keep local state in `render`, not in a top-level story object

## Remove Legacy Runtime and Knobs Imports

Before:

```tsx
import { storiesOf } from '@storybook/react-native/V6';
import { text, boolean } from '@storybook/addon-knobs';
import { withKnobs } from '@storybook/addon-ondevice-knobs';
```

After:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
```

If the file previously depended on a knobs decorator, remove it after converting the story to args-based CSF:

```diff
-storiesOf('Example', module).addDecorator(withKnobs);
```

The replacement should live in the CSF `meta` object with `args` and `argTypes`, not in a decorator import.

## Checklist

After converting a file:

- remove `storiesOf` imports
- remove `module` usage
- remove knobs and legacy decorator imports
- export a default `meta` object
- add a `StoryObj<typeof meta>` alias
- convert each `.add(...)` call into a named story export
