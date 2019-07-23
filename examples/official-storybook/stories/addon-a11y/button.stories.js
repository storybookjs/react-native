import React from 'react';
import Button from '../../components/addon-a11y/Button';

const text = 'Testing the a11y addon';

export default {
  title: 'Addons|A11y/Button',
  component: Button,
  parameters: {
    options: { selectedPanel: 'storybook/a11y/panel' },
  },
};

export const Default = () => <Button />;
export const Content = () => <Button content={text} />;
export const Label = () => <Button label={text} />;
export const Disabled = () => <Button disabled content={text} />;
export const invalidContrast = () => <Button contrast="wrong" content={text} />;
invalidContrast.story = {
  name: 'Invalid contrast',
};
