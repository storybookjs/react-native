import type { StoryObj, Meta } from '@storybook/react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface CounterProps {
  /** Value the counter starts from */
  initial?: number;
  /** Called after every increment */
  onPress?: () => void;
}

function Counter({ initial = 0, onPress }: CounterProps) {
  const [count, setCount] = useState(initial);

  return (
    <Pressable
      accessibilityRole="button"
      style={styles.button}
      onPress={() => {
        setCount((value) => value + 1);
        onPress?.();
      }}
    >
      <Text style={styles.label}>Pressed {count} times</Text>
    </Pressable>
  );
}

const NotesExampleMeta: Meta<typeof Counter> = {
  component: Counter,
  args: { initial: 0 },
  parameters: {
    notes: `
# Counter

The pressable counter rendered in this story. Open the addons panel to read these notes. Notes are rendered natively by
[react-native-enriched-markdown](https://github.com/software-mansion/enriched-markdown), so
headings, lists, tables, task lists and syntax-highlighted code all work out of the box.

## Usage

\`\`\`tsx
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

interface CounterProps {
  initial?: number;
  onPress?: () => void;
}

export function Counter({ initial = 0, onPress }: CounterProps) {
  const [count, setCount] = useState(initial);

  // Each press increments the counter and notifies the parent
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        setCount((value) => value + 1);
        onPress?.();
      }}
    >
      <Text>Pressed {count} times</Text>
    </Pressable>
  );
}
\`\`\`

### Props

| Prop      | Type         | Default | Description                     |
| --------- | ------------ | ------- | ------------------------------- |
| \`initial\` | \`number\`     | \`0\`     | Value the counter starts from   |
| \`onPress\` | \`() => void\` | –       | Called after every increment    |

### Installation

\`\`\`bash
npx expo install react-native-enriched-markdown
npx expo prebuild
\`\`\`

Enable syntax highlighting for the languages you need in \`package.json\`:

\`\`\`json
{
  "enriched-markdown": {
    "enableCodeHighlight": true,
    "codeHighlightLanguages": ["tsx", "bash", "json"]
  }
}
\`\`\`

## Formatting reference

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

Inline content can be **strong**, _emphasized_, ~~struck out~~, ==highlighted==, \`code\`, or a [hyperlink](http://example.com).

Superscript and subscript work too: E = mc^2^ and H~2~O.

![Storybook logo](https://raw.githubusercontent.com/storybookjs/brand/main/icon/icon-storybook-default.png)

---

- Unordered lists are not numbered
- And can be nested
  - As deeply as desired
- And then resume afterwards

1. Ordered lists are numbered
2. And can be nested too
   1. Also as deeply as desired
3. And then resume afterwards

- [x] Task lists render native checkboxes
- [x] Checked items can be styled
- [ ] Unchecked items too

---

    Indented code blocks are monospace text
      where leading whitespace is preserved

> Block quotes are blocks of normal text
> where **inline** markup is possible and
>
>> can be nested too.
>
> - Block content is even possible!
`,
  },
};
export default NotesExampleMeta;

type NotesExampleStory = StoryObj<typeof Counter>;

export const NotesExample: NotesExampleStory = {
  parameters: { noSafeArea: false },
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1EA7FD',
  },
  label: { color: '#FFFFFF', fontWeight: '600' },
});
