import initStoryshots, { snapshotWithOptions } from '@storybook/addon-storyshots';
import path from 'path';
import { mount as renderer } from 'enzyme';

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  test: snapshotWithOptions({
    renderer,
  }),
});
