import React from 'react';
import { withInfo } from '@storybook/addon-info';
import BaseButton from '../../components/BaseButton';

export default {
  title: 'Addons|Info/Decorator',
  decorators: [withInfo('Info can take options via the global or local decorator as well.')],
};

export const useInfo = () => <BaseButton label="Button" />;
useInfo.story = { name: 'Use Info as story decorator' };
