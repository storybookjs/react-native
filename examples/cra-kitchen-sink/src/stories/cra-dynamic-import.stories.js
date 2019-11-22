import React from 'react';
import { forceReRender } from '@storybook/react';

let Component;

export default {
  title: 'CRA',
};

export const Story1 = () => {
  if (!Component) {
    import('@storybook/react/demo').then(({ Button }) => {
      Component = Button;
      forceReRender();
    });

    return <div>Waiting for Dynamic Import</div>;
  }

  return <Component>Hello Button</Component>;
};

Story1.story = { name: 'Dynamic import' };
