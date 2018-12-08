import React from 'react';
import { storiesOf, forceReRender } from '@storybook/react';

let Component;

storiesOf('CRA', module).add('Dynamic import', () => {
  if (!Component) {
    import('@storybook/react/demo').then(({ Button }) => {
      Component = Button;
      forceReRender();
    });

    return <div>Waiting for Dynamic Import</div>;
  }

  return <Component>Hello Button</Component>;
});
