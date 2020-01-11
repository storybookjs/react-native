import React from 'react';
import { DocgenButton } from '../../components/DocgenButton';

const ForwardedButton = React.forwardRef((props, ref) => <DocgenButton ref={ref} {...props} />);

export default {
  title: 'Addons|Docs/ForwardRef',
  component: ForwardedButton,
  parameters: { chromatic: { disable: true } },
};

export const displaysCorrectly = () => <ForwardedButton>Hello World!</ForwardedButton>;
displaysCorrectly.story = { name: 'Displays forwarded ref components correctly' };
