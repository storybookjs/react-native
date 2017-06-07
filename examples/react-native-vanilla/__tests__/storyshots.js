import path from 'path';
import initStoryshots, { snapshotWithOptions } from '@storybook/addon-storyshots';

initStoryshots({
  framework: 'react-native',
  configPath: path.join(__dirname, '..', 'storybook'),
});
