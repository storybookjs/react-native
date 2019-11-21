import React from 'react';
import { withInfo } from '@storybook/addon-info';
import ForwardedRefButton from '../../components/ForwardedRefButton';
import ForwardedRefButtonWDisplayName from '../../components/ForwardedRefButtonWDisplayName';

export default {
  title: 'Addons/Info/ForwardRef',
  decorators: [withInfo],
};

export const DisplaysCorrectly = () => <ForwardedRefButton label="Forwarded Ref Button" />;
DisplaysCorrectly.story = { name: 'Displays forwarded ref components correctly' };

export const DisplayName = () => (
  <ForwardedRefButtonWDisplayName label="Forwarded Ref Button w/ Display Name" />
);
DisplayName.story = { name: 'Uses forwardRef displayName if available' };
