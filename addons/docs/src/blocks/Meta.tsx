import React from 'react';

type Decorator = (...args: any) => any;

interface MetaProps {
  title: string;
  component?: any;
  decorators?: [Decorator];
  parameters?: any;
}

/**
 * This component is used to declare component metadata in docs
 * and gets transformed into a default export underneath the hood.
 * It doesn't actually render anything.
 */
export const Meta: React.FunctionComponent<MetaProps> = props => null;
