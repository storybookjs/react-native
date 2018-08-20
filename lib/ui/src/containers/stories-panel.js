import React from 'react';
import { inject } from 'mobx-react';
import { Explorer } from '@storybook/components';

import { toNested } from '../libs/nav/nav';

const StoriesPanel = ({ stories, hierarchyRootSeparator, hierarchySeparator }) => (
  <Explorer
    stories={toNested(stories, {
      rootSeperator: hierarchyRootSeparator,
      groupSeperator: hierarchySeparator,
    })}
  />
);

export default inject(({ store }) => ({
  stories: store.stories,
  hierarchyRootSeparator: store.uiOptions.hierarchyRootSeparator,
  hierarchySeparator: store.uiOptions.hierarchySeparator,
}))(StoriesPanel);
