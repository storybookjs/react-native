import React from 'react';
import { styled } from '@storybook/theming';

const Panel = styled.div();

export default {
  title: 'Addons|Viewport',
};
export const defaultFn = () => (
  <Panel>I don't have problems being rendered using the default viewport.</Panel>
);
defaultFn.story = { name: 'default' };
