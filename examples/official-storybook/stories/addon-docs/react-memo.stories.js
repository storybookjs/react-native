import React from 'react';
import { DocgenButton } from '../../components/DocgenButton';

const ButtonWithMemo = React.memo(props => <DocgenButton {...props} />);

export default {
  title: 'Addons|Docs/ButtonWithMemo',
  component: ButtonWithMemo,
  parameters: { chromatic: { disable: true } },
};

export const displaysCorrectly = () => <ButtonWithMemo>Hello World!</ButtonWithMemo>;
displaysCorrectly.story = { name: 'Displays components with memo correctly' };
