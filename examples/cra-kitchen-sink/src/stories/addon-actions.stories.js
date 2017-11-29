import React from 'react';
import { storiesOf } from '@storybook/react';
import { action, decorateAction } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';
import { File } from 'global';

const pickFirst = decorateAction([args => args.slice(0, 1)]);

storiesOf('Addon Actions', module)
  .add('Hello World', () => <Button onClick={action('hello-world')}>Hello World</Button>)
  .add('Decorated Action', () => <Button onClick={pickFirst('decorated')}>First Argument</Button>)
  .add('Circular Payload', () => {
    const circular = { foo: {} };
    circular.foo.circular = circular;
    return <Button onClick={() => action('circular')(circular)}>Circular Payload</Button>;
  })
  .add('Function Name', () => {
    const fn = action('fnName');
    return <Button onClick={fn}>Action.name: {fn.name}</Button>;
  })
  .add('Reserved keyword as name', () => <Button onClick={action('delete')}>Delete</Button>)
  .add('File object as payload', () => {
    const file = new File([''], 'filename.txt', { type: 'text/plain', lastModified: new Date() });
    return <Button onClick={() => action('file')(file)}>File</Button>;
  });
