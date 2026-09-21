import preview from '../../.rnstorybook/preview';
import { Text, View } from 'react-native';

const PlayComponent = ({ label }: { label: string }) => (
  <View>
    <Text testID="play-label">{label}</Text>
  </View>
);

const meta = preview.meta({
  title: 'FactoriesEdgeCases/Play Function',
  component: PlayComponent,
});

export default meta;

export const WithPlay = meta.story({
  args: { label: 'Has a play function' },
  play: async () => {
    console.log('play function executed');
  },
});

export const WithoutPlay = meta.story({
  args: { label: 'No play function' },
});
