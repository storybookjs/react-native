import React from 'react';
import { styled } from '@storybook/theming';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const Panel = styled.div();

export default {
  title: 'Addons|Viewport',
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
};
export const defaultFn = () => (
  <Panel>I don't have problems being rendered using the default viewport.</Panel>
);
defaultFn.story = { name: 'default' };
