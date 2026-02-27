export const storyInstructions = `# Writing React Native UI Components

When writing UI, prefer breaking larger components up into smaller parts.

ALWAYS write a Storybook story for any component written. If editing a component, ensure appropriate changes have been made to stories for that component.

## How to write good stories

Goal: Cover every distinct piece of business logic and state the component can reach (happy paths, error/edge states, loading, permissions/roles, empty states, variations from props/context). Avoid redundant stories that show the same logic.

Interactivity: For interactive components, create separate stories that demonstrate each interaction state. Use \`fn()\` from \`storybook/test\` to mock callback props so you can verify they are wired up correctly.

Data/setup: Provide realistic props, state, and mocked data. Include meaningful labels/text to make behaviors observable. Stub network/services with deterministic fixtures; keep stories reliable.

Variants to consider (pick only those that change behavior): default vs. alternate themes; loading vs. loaded vs. empty vs. error; validated vs. invalid input; permissions/roles/capabilities; feature flags; size/density/layout variants that alter logic.

Accessibility: Use semantic roles/labels where applicable.

Naming/structure: Use clear story names that describe the scenario ("Error state after failed submit"). Group related variants logically; don't duplicate.

Imports/format: Import Meta/StoryObj from the framework package. Keep stories minimal—only what's needed to demonstrate behavior.

## React Native Storybook Essentials

### Framework and Renderer

React Native Storybook uses \`@storybook/react-native\` as the framework. Stories use the same CSF (Component Story Format) as web Storybook.

### Meta and StoryObj imports

\`\`\`ts
import type { Meta, StoryObj } from '@storybook/react-native';
\`\`\`

### Story file structure

\`\`\`tsx
import type { Meta, StoryObj } from '@storybook/react-native';
import { MyComponent } from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Components/MyComponent',
  component: MyComponent,
  args: {
    // default args
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCustomProps: Story = {
  args: {
    label: 'Custom Label',
    variant: 'secondary',
  },
};
\`\`\`

### Global State Changes

The \`globals\` annotation has been renamed to \`initialGlobals\`:

\`\`\`diff
// .rnstorybook/preview.js
export default {
- globals: { theme: 'light' }
+ initialGlobals: { theme: 'light' }
};
\`\`\`

### React Native Specific Considerations

- The config directory is \`.rnstorybook\` (not \`.storybook\`)
- Stories run on-device (iOS/Android), not in a browser
- Use React Native components (\`View\`, \`Text\`, \`Pressable\`, etc.), not HTML elements
- \`StyleSheet\` or inline styles instead of CSS
- No DOM APIs — use React Native's layout system (Flexbox)
- For navigation-dependent components, mock the navigation context
- For platform-specific stories, use \`Platform.OS\` checks or separate story files
- Test on both iOS and Android when possible

### Key Requirements

- **Node.js 20+**, **TypeScript 4.9+**
- React Native 0.72+
- Storybook 10+
`;
