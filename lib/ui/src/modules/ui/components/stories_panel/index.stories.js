import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import StoriesPanel from './index';
import { createHierarchy } from '../../libs/hierarchy';
import withLifecyle from '../../../../libs/withLifecycleDecorator';
import { setContext } from '../../../../compose';

const decorator = withLifecyle({
  beforeEach() {
    setContext({
      clientStore: {
        getAll() {
          return { shortcutOptions: {} };
        },
        subscribe() {},
      },
    });
  },
  afterEach() {
    setContext(null);
  },
});

const storiesHierarchy = createHierarchy([{ kind: 'kk', namespaces: ['kk'], stories: ['bb'] }]);
const openShortcutsHelp = action('openShortcutsHelp');
const onStoryFilter = action('onStoryFilter');
storiesOf('ui/stories/StoriesPanel', module)
  .addDecorator(decorator)
  .add('default', () => (
    <StoriesPanel
      filter="xxxxx"
      openShortcutsHelp={openShortcutsHelp}
      onStoryFilter={onStoryFilter}
    />
  ))
  .add('with storiesHierarchy prop', () => (
    <StoriesPanel
      storiesHierarchy={storiesHierarchy}
      selectedKind="kk"
      selectedStory="bb"
      selectedHierarchy={['kk']}
      openShortcutsHelp={openShortcutsHelp}
      onStoryFilter={onStoryFilter}
    />
  ))
  .add('storiesHierarchy exists but is empty', () => (
    <StoriesPanel
      storiesHierarchy={createHierarchy([])}
      openShortcutsHelp={openShortcutsHelp}
      onStoryFilter={onStoryFilter}
    />
  ));
