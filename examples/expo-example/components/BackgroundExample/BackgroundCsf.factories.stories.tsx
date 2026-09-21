import preview from '../../.rnstorybook/preview';
import { Text, StyleSheet } from 'react-native';

const Background = () => (
  <Text style={styles.text}>Change background color via Addons -&gt; Background</Text>
);

const styles = StyleSheet.create({
  text: { color: 'black' },
});

const meta = preview.meta({
  component: Background,
  parameters: {
    backgrounds: {
      options: {
        warm: { name: 'Warm', value: 'hotpink' },
        cool: { name: 'Cool', value: 'deepskyblue' },
        white: { name: 'White', value: 'white' },
        black: { name: 'Black', value: 'black' },
      },
    },
  },
});

export default meta;

export const Basic = meta.story({
  globals: {
    backgrounds: { value: 'warm' },
  },
});
