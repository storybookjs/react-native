import React from 'react';
import { ArgsStoryFn } from '@storybook/csf';
import { ReactFramework } from '../types-6.0';

export const render: ArgsStoryFn<ReactFramework> = (args, context) => {
  const { id, component: Component } = context;
  if (!Component) {
    throw new Error(
      `Unable to render story ${id} as the component annotation is missing from the default export`
    );
  }

  return <Component {...args} />;
};
