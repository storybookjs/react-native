import React, { FunctionComponent } from 'react';
import { H3 } from '@storybook/components/html';

interface SubheadingProps {
  children: JSX.Element | string;
}
export const Subheading: FunctionComponent<SubheadingProps> = ({ children }) => <H3>{children}</H3>;
