import React from 'react';
import { styled } from '@storybook/theming';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

const Panel = styled.div();

export default {
  title: 'Addons/Viewport',
  parameters: {
    viewport: {
      viewports: INITIAL_VIEWPORTS,
    },
  },
};
export const DefaultFn = () => (
  <Panel>I don't have problems being rendered using the default viewport.</Panel>
);
DefaultFn.story = { name: 'default' };
