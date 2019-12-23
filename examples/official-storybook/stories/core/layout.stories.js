import React from 'react';
import { Button } from '@storybook/components';

export default {
  title: 'Core/Layout',
  parameters: {
    layout: 'padded',
  },
};

export const InheritedLayout = () => <Button>a button</Button>;

export const PaddedLayout = () => <Button>a button</Button>;
PaddedLayout.story = {
  parameters: {
    layout: 'padded',
  },
};

export const CenteredLayout = () => <Button>a button</Button>;
CenteredLayout.story = {
  parameters: {
    layout: 'centered',
  },
};

export const CenteredBlockLayout = () => (
  <div>
    <Button>a button</Button>
  </div>
);
CenteredBlockLayout.story = {
  parameters: {
    layout: 'centered',
  },
};

export const FullScreenLayout = () => <Button>a button</Button>;
FullScreenLayout.story = {
  parameters: {
    layout: 'fullscreen',
  },
};
