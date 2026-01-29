# Controls Reference

Complete reference for all control types supported by `@storybook/addon-ondevice-controls`.

## Control Types

### text

Basic string input.

```tsx
argTypes: {
  name: { control: { type: 'text' } },
}
```

### number

Numeric input. Add `range: true` or use `type: 'range'` for a slider.

```tsx
argTypes: {
  quantity: { control: { type: 'number' } },
  opacity: { control: { type: 'number', min: 0, max: 1, step: 0.1, range: true } },
  age: { step: 5, min: 0, max: 90, range: true },
}
```

### range

Dedicated slider control. Requires `@react-native-community/slider`.

```tsx
argTypes: {
  volume: { control: { type: 'range', min: 0, max: 100, step: 5 } },
}
```

### boolean

Toggle switch using React Native's native Switch.

```tsx
argTypes: {
  isEnabled: { control: { type: 'boolean' } },
}
```

### select

Dropdown with optional custom labels.

```tsx
argTypes: {
  size: {
    options: ['small', 'medium', 'large'],
    control: { type: 'select' },
  },
  fruit: {
    options: ['apple', 'banana', 'cherry'],
    control: {
      type: 'select',
      labels: { apple: 'Apple', banana: 'Banana', cherry: 'Cherry' },
    },
  },
}
```

### radio

Radio button selection. Use `inline-radio` for horizontal layout.

```tsx
argTypes: {
  alignment: {
    options: ['left', 'center', 'right'],
    control: { type: 'radio' },
  },
  theme: {
    options: ['light', 'dark'],
    control: { type: 'inline-radio' },
  },
}
```

### multi-select

Multiple selection returning an array.

```tsx
argTypes: {
  features: {
    options: ['feature1', 'feature2', 'feature3'],
    control: { type: 'multi-select' },
  },
}
```

### color

Color picker (modal on native, HTML input on web).

```tsx
argTypes: {
  backgroundColor: { control: { type: 'color' } },
}
```

### date

Date/time picker. Requires `@react-native-community/datetimepicker`.

```tsx
argTypes: {
  createdAt: { control: { type: 'date' } },
}
args: {
  createdAt: new Date(1983, 1, 25),
}
```

### array

Comma-separated value input.

```tsx
argTypes: {
  tags: { control: { type: 'array' }, separator: ',' },
}
args: {
  tags: ['react', 'native', 'storybook'],
}
```

### object

JSON object editor.

```tsx
argTypes: {
  config: { control: { type: 'object' } },
}
args: {
  config: { theme: 'light', animations: true },
}
```

## Conditional Controls

Show/hide controls based on other arg values:

```tsx
argTypes: {
  advanced: { control: 'boolean' },
  padding: { control: 'number', if: { arg: 'advanced' } },
  url: { control: 'text', if: { arg: 'type', eq: 'link' } },
}
```

## Select with Mapping

Map display values to internal values:

```tsx
argTypes: {
  arrow: {
    options: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
    mapping: { ArrowUp: '⬆', ArrowDown: '⬇', ArrowLeft: '⬅️', ArrowRight: '➡️' },
    control: {
      type: 'select',
      labels: { ArrowUp: 'Up', ArrowDown: 'Down', ArrowLeft: 'Left', ArrowRight: 'Right' },
    },
  },
}
```

## Auto-Detection

TypeScript prop types are automatically mapped:

| Prop Type                | Control |
| ------------------------ | ------- |
| `string`                 | text    |
| `number`                 | number  |
| `boolean`                | boolean |
| `'a' \| 'b' \| 'c'`      | select  |
| prop matching `/color/i` | color   |
| prop matching `/Date$/`  | date    |

Configure auto-detection matchers in preview.tsx:

```tsx
parameters: {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
```

## Complete Example

```tsx
import type { Meta, StoryObj } from '@storybook/react-native';
import { MyComponent } from './MyComponent';

const meta = {
  component: MyComponent,
  argTypes: {
    title: { control: { type: 'text' } },
    fontSize: { control: { type: 'range', min: 12, max: 24, step: 1 } },
    isVisible: { control: { type: 'boolean' } },
    variant: {
      options: ['primary', 'secondary', 'danger'],
      control: { type: 'select' },
    },
    backgroundColor: { control: { type: 'color' } },
    tags: { control: { type: 'array' } },
    config: { control: { type: 'object' } },
    lastUpdated: { control: { type: 'date' } },
  },
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  args: {
    title: 'Sample',
    fontSize: 16,
    isVisible: true,
    variant: 'primary',
    backgroundColor: '#007AFF',
    tags: ['react', 'native'],
    config: { theme: 'light', animations: true },
    lastUpdated: new Date(),
  },
};
```

## Dependencies

Some controls require additional native packages:

- **Range/slider**: `@react-native-community/slider`
- **Date picker**: `@react-native-community/datetimepicker`
