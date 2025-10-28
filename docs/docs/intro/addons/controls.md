---
sidebar_position: 1
---

# Controls Addon

The `@storybook/addon-ondevice-controls` addon provides interactive controls for dynamically editing component props directly on your device. This allows you to experiment with different component states without modifying code.

## Installation

```bash
npm install @storybook/addon-ondevice-controls
```

Add it to your addons list in `.rnstorybook/main.ts`:

```typescript
const main: StorybookConfig = {
  addons: [
    '@storybook/addon-ondevice-controls',
    // ... other addons
  ],
};
```

## Supported Control Types

The React Native controls addon supports **13 different control types** optimized for mobile interfaces:

### Text Input Controls

#### `text`

Basic text input control for string values.

```typescript
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

```typescript
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

```typescript
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

```typescript
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

```typescript
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

```typescript
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

```typescript
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

```typescript
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

```typescript
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

```typescript
export default {
  component: MyComponent,
  argTypes: {
    createdAt: {
      control: { type: 'date' },
    },
  },
};
```

**Dependencies:** Requires `@react-native-community/datetimepicker` for React Native projects.

### Complex Data Controls

#### `array`

Array input control that parses comma-separated values.

```typescript
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

```typescript
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

```typescript
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

```typescript
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
- **Date picker**: Separate date and time selection modals
- **Select**: Modal-based selection interface
- **Range**: Native slider component (requires `@react-native-community/slider`)

### Web (React Native Web)

- **Color picker**: Native HTML color input
- **Date picker**: Native HTML datetime-local input
- **Select**: Native HTML select element

## Advanced Configuration

### Conditional Controls

```typescript
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

## Best Practices

1. **Use descriptive labels**: Provide clear labels for select and radio options
2. **Set sensible ranges**: Define appropriate min/max values for numeric controls
3. **Provide default values**: Set reasonable defaults in story args
4. **Test with real data**: Use realistic data in your control examples

## Dependencies

Some controls require additional React Native dependencies:

- **Range controls**: `@react-native-community/slider`
- **Date controls**: `@react-native-community/datetimepicker`

Install these as needed:

```bash
npm install @react-native-community/slider @react-native-community/datetimepicker
```

## Troubleshooting

### Controls Not Appearing

- Ensure the addon is installed and added to `main.ts`
- Check that `argTypes` are properly configured
- Verify component props are typed correctly for auto-detection

### Date Picker Issues

- Install `@react-native-community/datetimepicker`
- For iOS: Follow platform-specific setup instructions
- Ensure proper date value formatting in args

### Slider Not Working

- Install `@react-native-community/slider`
- Set `range: true` or use `type: 'range'` in control config
- Verify min/max/step values are valid
