import initStoryshots, { multiSnapshotWithOptions } from '@storybook/addon-storyshots';
import path from 'path';
import { mount as renderer } from 'enzyme';

function createNodeMock(element) {
  if (element.type === 'div') {
    return { scrollWidth: 123 };
  }
  return null;
}

initStoryshots({
  framework: 'react',
  configPath: path.join(__dirname, '..', '.storybook'),
  test: multiSnapshotWithOptions({
    createNodeMock,
    renderer,
  }),
});
