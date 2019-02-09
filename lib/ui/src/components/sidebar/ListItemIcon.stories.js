import React from 'react';

import { TooltipLinkList } from '@storybook/components';
import ListItemIcon from './ListItemIcon';

export default {
  component: ListItemIcon,
  title: 'UI|Sidebar/ListItemIcon',
};

export const all = () => (
  <TooltipLinkList
    links={[
      { title: 'has icon', left: <ListItemIcon icon="check" /> },
      { title: 'has imgSrc', left: <ListItemIcon imgSrc="https://via.placeholder.com/20" /> },
      { title: 'has neither', left: <ListItemIcon /> },
    ]}
  />
);
