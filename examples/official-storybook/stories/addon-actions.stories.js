/* global window */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action, configureActions, decorateAction } from '@storybook/addon-actions';
import { setOptions } from '@storybook/addon-options';
import { Button } from '@storybook/react/demo';
import { File } from 'global';

const pickFirst = decorateAction([args => args.slice(0, 1)]);

storiesOf('Addons|Actions', module)
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
  .add('All types', () => {
    function A() {}
    function B() {}

    const bound = B.bind({});

    let file;
    try {
      file = new File([''], 'filename.txt', { type: 'text/plain', lastModified: new Date() });
    } catch (error) {
      file = error;
    }
    const reg = /fooBar/g;

    return (
      <div>
        {setOptions({ selectedAddonPanel: 'storybook/actions/actions-panel' })}
        <Button onClick={() => action('Array')(['foo', 'bar', { foo: 'bar' }])}>Array</Button>
        <Button onClick={() => action('Boolean')(false)}>Boolean</Button>
        <Button onClick={() => action('Empty Object')({})}>Empty Object</Button>
        <Button onClick={() => action('File')(file)}>File</Button>
        <Button onClick={() => action('Function')(A)}>Function A</Button>
        <Button onClick={() => action('Function (bound)')(bound)}>Bound Function A</Button>
        <Button onClick={() => action('Infinity')(Infinity)}>Infinity</Button>
        <Button onClick={() => action('-Infinity')(-Infinity)}>-Infinity</Button>
        <Button onClick={() => action('NaN')(NaN)}>NaN</Button>
        <Button onClick={() => action('null')(null)}>null</Button>
        <Button onClick={() => action('Number')(10000)}>Number</Button>
        <Button
          onClick={() =>
            action('Multiple')(
              'foo',
              1000,
              true,
              false,
              [1, 2, 3],
              null,
              undefined,
              { foo: 'bar' },
              window
            )
          }
        >
          Multiple
        </Button>
        <Button onClick={() => action('Plain Object')({ foo: { bar: { baz: { bar: 'foo' } } } })}>
          Plain Object
        </Button>
        <Button
          onClick={() =>
            action('ObjectDepth2', { depth: 2 })({ root: { one: { two: { three: 'foo' } } } })
          }
        >
          Object (depth: 2)
        </Button>
        <Button onClick={() => action('RegExp')(reg)}>RegExp</Button>
        <Button onClick={() => action('String')('foo')}>String</Button>
        <Button onClick={() => action('Symbol')(Symbol('A_SYMBOL'))}>Symbol</Button>
        <Button onClick={action('SyntheticMouseEvent')}>SyntheticEvent</Button>
        <Button onClick={() => action('undefined')(undefined)}>undefined</Button>
        <Button onClick={() => action('window')(window)}>Window</Button>
      </div>
    );
  })
  .add('configureActions', () => {
    configureActions({
      depth: 2,
    });

    return (
      <Button
        onClick={() => action('ConfiguredDepth')({ root: { one: { two: { three: 'foo' } } } })}
      >
        Object (configured depth: 2)
      </Button>
    );
  })
  .add('Clearing the action logger', () => (
    <div>
      <p>Moving away from this story will clear the action logger</p>
      <Button onClick={action('clear-action-logger', { clearActionLogger: true })}>
        Object (clearActionLogger: true)
      </Button>
    </div>
  ));
