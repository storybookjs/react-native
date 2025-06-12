import type { StoryObj, Meta } from '@storybook/react-native';
import { View, StyleSheet, Text } from 'react-native';

const NotesExampleMeta: Meta<any> = {
  parameters: {
    notes: `
# H1

## H2

### H3

#### H4

##### H5

###### H6

This is a paragraph that can span multiple lines. It should be line-wrapped
but not contain any paragraph breaks.

Unless a paragraph break is explicitly used.

Inline content can be **strong**, _emphasized_, ~~struck out~~, \`code\`, or a [hyperlink](http://example.com).

---

- Unordered lists are not numbered

- And can be nested

    + As deeply as desired
    
- And then resume afterwards

---

1. Ordered lists are numbered

2. And can be nested too

   1. Also as deeply as desired
   
3. And then resume afterwards

---

\`\`\`tsx
Code fences are blocks of monospace text

  where leading whitespace is preserved,

    and **inline** markup is not supported.
\`\`\`

---

    Code blocks are blocks of monospace text

      where leading whitespace is preserved,

        and **inline** markup is not supported.

---

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

type NotesExampleStory = StoryObj<any>;

function NotesContent() {
  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <Text>This story exercises the notes addon, see the addons panel.</Text>
    </View>
  );
}

export const NotesExample: NotesExampleStory = () => <NotesContent />;
NotesExample.parameters = { noSafeArea: false };
