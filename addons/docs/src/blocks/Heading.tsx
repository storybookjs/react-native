import React, { FunctionComponent } from 'react';
import { H2 } from '@storybook/components/html';

interface HeadingProps {
  children: JSX.Element | string;
}
export const Heading: FunctionComponent<HeadingProps> = ({ children }) => <H2>{children}</H2>;
