import React from 'react';
import { Button } from '@storybook/react/demo';

const ForwardedButton = React.forwardRef((props, ref) => <Button ref={ref} {...props} />);

export default {
  title: 'Addons|Docs/ForwardRef',
  component: ForwardedButton,
};

export const displaysCorrectly = () => <ForwardedButton>Hello World!</ForwardedButton>;
displaysCorrectly.story = { name: 'Displays forwarded ref components correctly' };
