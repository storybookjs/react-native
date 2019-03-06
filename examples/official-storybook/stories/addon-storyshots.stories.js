import React from 'react';
import { storiesOf } from '@storybook/react';
import { styled } from '@storybook/theming';

const Block = styled.div({
  display: 'inline-block',
  height: 400,
  width: 400,
  background: 'hotpink',
});

storiesOf('Addons|Storyshots', module).add('block', () => <Block />);
