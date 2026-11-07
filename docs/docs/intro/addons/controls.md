---
sidebar_position: 1
---

# Controls

Controls let you edit component props directly on your device, so you can try different component states without changing code.

## Installation

Nothing to install. From v11 the Controls panel is built into `@storybook/react-native` and on by default. See [Controls configuration](../configuration/controls.md) to turn it off, or to add the optional native date picker and slider.

:::note[`@storybook/addon-ondevice-controls`]
The `@storybook/addon-ondevice-controls` package is deprecated. It's now an empty stub kept so existing configs keep working. Remove it from `deviceAddons` and uninstall it.
:::

## Supported Control Types

The React Native Controls panel supports **13 different control types** optimized for mobile interfaces:

### Text Input Controls

#### `text`

Basic text input control for string values.

```ts
export default {
  component: MyComponent,
  argTypes: {
    name: {
      control: { type: 'text' },
    },
  },
};
```

#### `number`

Numeric input with optional range slider functionality.

```ts
export default {
  component: MyComponent,
  argTypes: {
    // Basic number input
    quantity: {
      control: { type: 'number' },
    },

    // Range slider
    opacity: {
      control: {
        type: 'number',
        min: 0,
        max: 1,
        step: 0.1,
        range: true, // Displays as slider
      },
    },
  },
};
```

#### `range`

Dedicated slider control for numeric ranges.

```ts
export default {
  component: MyComponent,
  argTypes: {
    volume: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 5,
      },
    },
  },
};
```

### Boolean Controls

#### `boolean`

Toggle switch using React Native's native Switch component.

```ts
export default {
  component: MyComponent,
  argTypes: {
    isEnabled: {
      control: { type: 'boolean' },
    },
  },
};
```

### Selection Controls

#### `select`

Dropdown selection with support for custom labels.

```ts
export default {
  component: MyComponent,
  argTypes: {
    size: {
      options: ['small', 'medium', 'large'],
      control: { type: 'select' },
    },

    // With custom labels
    fruit: {
      options: ['apple', 'banana', 'cherry'],
      control: {
        type: 'select',
        labels: {
          apple: 'Apple 🍎',
          banana: 'Banana 🍌',
          cherry: 'Cherry 🍒',
        },
      },
    },
  },
};
```

#### `radio`

Radio button selection for exclusive choices.

```ts
export default {
  component: MyComponent,
  argTypes: {
    alignment: {
      options: ['left', 'center', 'right'],
      control: { type: 'radio' },
    },
  },
};
```

#### `inline-radio`

Inline radio button layout for horizontal display.

```ts
export default {
  component: MyComponent,
  argTypes: {
    theme: {
      options: ['light', 'dark'],
      control: {
        type: 'inline-radio', // or type: 'radio' with isInline: true
      },
    },
  },
};
```

#### `multi-select`

Multiple selection control returning an array of values.

```ts
export default {
  component: MyComponent,
  argTypes: {
    features: {
      options: ['feature1', 'feature2', 'feature3'],
      control: { type: 'multi-select' },
    },
  },
};
```

### Color Controls

#### `color`

Full-featured color picker with mobile-optimized interface.

```ts
export default {
  component: MyComponent,
  argTypes: {
    backgroundColor: {
      control: { type: 'color' },
    },
    textColor: {
      control: { type: 'color' },
    },
  },
};
```

### Date Controls

#### `date`

Date and time picker with native mobile interfaces.

```ts
export default {
  component: MyComponent,
  argTypes: {
    createdAt: {
      control: { type: 'date' },
    },
  },
};
```

**Optional dependency:** with `@react-native-community/datetimepicker` installed and linked you get the native date and time pickers. Without it the date and time are edited in text inputs (`YYYY-MM-DD` and `HH:mm`).

### Complex Data Controls

#### `array`

Array input control that parses comma-separated values.

```ts
export default {
  component: MyComponent,
  argTypes: {
    tags: {
      control: {
        type: 'array',
        separator: ',', // Optional: default is comma
      },
    },
  },
};
```

#### `object`

JSON object editor with syntax validation.

```ts
export default {
  component: MyComponent,
  argTypes: {
    config: {
      control: { type: 'object' },
    },
    user: {
      control: { type: 'object' },
    },
  },
};
```

## Auto-Detection

Controls can be automatically inferred from your component's prop types:

```ts
// TypeScript component
interface ButtonProps {
  label: string; // → text control
  disabled: boolean; // → boolean control
  size: 'sm' | 'md' | 'lg'; // → select control
  count: number; // → number control
}

// Controls are automatically generated based on prop types
export default {
  component: Button,
  // No argTypes needed - controls auto-detected!
};
```

## Story Examples

### Complete Story with Multiple Control Types

```ts
import type { Meta, StoryObj } from '@storybook/react-native';
import { MyComponent } from './MyComponent';

const meta = {
  component: MyComponent,
  argTypes: {
    // Text
    title: { control: { type: 'text' } },

    // Numbers and ranges
    fontSize: {
      control: { type: 'range', min: 12, max: 24, step: 1 },
    },
    opacity: {
      control: { type: 'number', min: 0, max: 1, step: 0.1 },
    },

    // Boolean
    isVisible: { control: { type: 'boolean' } },

    // Selection
    variant: {
      options: ['primary', 'secondary', 'danger'],
      control: { type: 'select' },
    },

    // Color
    backgroundColor: { control: { type: 'color' } },

    // Array
    tags: { control: { type: 'array' } },

    // Object
    config: { control: { type: 'object' } },

    // Date
    lastUpdated: { control: { type: 'date' } },
  },
} satisfies Meta<typeof MyComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Interactive: Story = {
  args: {
    title: 'Sample Component',
    fontSize: 16,
    opacity: 1,
    isVisible: true,
    variant: 'primary',
    backgroundColor: '#007AFF',
    tags: ['react', 'native'],
    config: { theme: 'light', animations: true },
    lastUpdated: new Date(),
  },
};
```

## Platform Differences

### Mobile (React Native)

- **Color picker**: Modal-based interface with triangle and holo color pickers
- **Date picker**: Separate date and time pickers (native with `@react-native-community/datetimepicker`, text inputs without it)
- **Select**: Modal-based selection interface
- **Range**: Native slider with `@react-native-community/slider`, a JavaScript slider without it

### Web (React Native Web)

- **Color picker**: Native HTML color input
- **Date picker**: Native HTML datetime-local input
- **Select**: Native HTML select element

## Advanced Configuration

### Conditional Controls

```ts
export default {
  component: MyComponent,
  argTypes: {
    type: {
      options: ['button', 'link'],
      control: { type: 'select' },
    },
    // Only show URL control when type is 'link'
    url: {
      control: { type: 'text' },
      if: { arg: 'type', eq: 'link' },
    },
  },
};
```

### Disabling Controls

To hide a single prop from the Controls panel, use any of the same `argTypes` annotations as Storybook web:

```ts
export default {
  component: MyComponent,
  argTypes: {
    // Hide the control for `internalId`
    internalId: { control: false },

    // Equivalent explicit form
    trackingId: { control: { disable: true } },

    // Hide the whole row
    debugFlag: { table: { disable: true } },
  },
};
```

To filter by name, use `include` or `exclude` in the `controls` parameter. Both accept either an array of prop names or a regular expression:

```ts
export default {
  component: MyComponent,
  parameters: {
    controls: { exclude: /^on[A-Z].*/ },
  },
};
```

These can also be set on an individual story. To hide the Controls panel entirely for a story, set `parameters.controls.disable` to `true`.

## Best Practices

1. **Use descriptive labels**: Provide clear labels for select and radio options
2. **Set sensible ranges**: Define appropriate min/max values for numeric controls
3. **Provide default values**: Set reasonable defaults in story args
4. **Test with real data**: Use realistic data in your control examples

## Optional dependencies

Two controls can use native modules. Both are optional, and fall back to JavaScript controls when they aren't installed or linked:

- **Range controls**: `@react-native-community/slider`
- **Date controls**: `@react-native-community/datetimepicker`

Install them if you want the native versions, then rebuild your app:

```sh
npm install @react-native-community/slider @react-native-community/datetimepicker
```

## Troubleshooting

### Controls Not Appearing

- Check that `features.ondeviceControls` isn't set to `false` in `main.ts`, and that the story doesn't set `parameters.controls.disable`
- Check that `argTypes` are properly configured
- Verify component props are typed correctly for auto-detection

### Date Picker Issues

- For native pickers, install `@react-native-community/datetimepicker` and rebuild the app. Without it (or before a rebuild) you get the text inputs, and a development warning if it's installed but not linked
- Ensure proper date value formatting in args

### Slider Not Working

- For the native slider, install `@react-native-community/slider` and rebuild the app; otherwise the JavaScript slider is used
- Set `range: true` or use `type: 'range'` in control config
- Verify min/max/step values are valid
