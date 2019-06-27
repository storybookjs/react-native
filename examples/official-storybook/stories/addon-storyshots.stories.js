import React from 'react';
import { styled } from '@storybook/theming';

const Block = styled.div({
  display: 'inline-block',
  height: 400,
  width: 400,
  background: 'hotpink',
});

export default {
  title: 'Addons|Storyshots',
};

export const block = () => <Block />;
