import React from 'react';
import { withInfo } from '@storybook/addon-info';
import ForwardedRefButton from '../../components/ForwardedRefButton';
import ForwardedRefButtonWDisplayName from '../../components/ForwardedRefButtonWDisplayName';

export default {
  title: 'Addons|Info/ForwardRef',
  decorators: [withInfo],
};

export const displaysCorrectly = () => <ForwardedRefButton label="Forwarded Ref Button" />;
displaysCorrectly.story = { name: 'Displays forwarded ref components correctly' };

export const displayName = () => (
  <ForwardedRefButtonWDisplayName label="Forwarded Ref Button w/ Display Name" />
);
displayName.story = { name: 'Uses forwardRef displayName if available' };
