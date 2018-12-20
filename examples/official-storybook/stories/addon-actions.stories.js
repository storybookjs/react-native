import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  action,
  actions,
  configureActions,
  decorate,
  decorateAction,
} from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';
import { window, File } from 'global';

const pickNative = decorate([args => [args[0].nativeEvent]]);
const pickNativeAction = decorateAction([args => [args[0].nativeEvent]]);

storiesOf('Addons|Actions', module)
  .add('Hello World', () => <Button onClick={action('hello-world')}>Hello World</Button>)
  .add('Multiple actions', () => (
    <Button {...actions('onClick', 'onMouseOver')}>Hello World</Button>
  ))
  .add('Multiple actions + config', () => (
    <Button {...actions('onClick', 'onMouseOver', { clearOnStoryChange: false })}>
      Moving away from this story will persist the action logger
    </Button>
  ))
  .add('Multiple actions, object', () => (
    <Button {...actions({ onClick: 'clicked', onMouseOver: 'hovered' })}>Hello World</Button>
  ))
  .add('Multiple actions, object + config', () => (
    <Button
      {...actions({ onClick: 'clicked', onMouseOver: 'hovered' }, { clearOnStoryChange: false })}
    >
      Moving away from this story will persist the action logger
    </Button>
  ))
  .add('Decorated action', () => (
    <Button onClick={pickNative.action('decorated')}>Native Event</Button>
  ))
  .add('Decorated action + config', () => (
    <Button onClick={pickNative.action('decorated', { clearOnStoryChange: false })}>
      Moving away from this story will persist the action logger
    </Button>
  ))
  .add('Decorated actions', () => (
    <Button {...pickNative.actions('onClick', 'onMouseOver')}>Native Event</Button>
  ))
  .add('Decorated actions + config', () => (
    <Button {...pickNative.actions('onClick', 'onMouseOver', { clearOnStoryChange: false })}>
      Moving away from this story will persist the action logger
    </Button>
  ))
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
  .add(
    'All types',
    () => {
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
    },
    { options: { selectedAddonPanel: 'storybook/actions/actions-panel' } }
  )
  .add('configureActionsDepth', () => {
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
  .add('Persisting the action logger', () => (
    <div>
      <p>Moving away from this story will persist the action logger</p>
      <Button onClick={action('clear-action-logger', { clearOnStoryChange: false })}>
        Object (configured clearOnStoryChange: false)
      </Button>
    </div>
  ))
  .add('Limit Action Output', () => {
    configureActions({
      limit: 2,
    });

    return (
      <div>
        <Button onClick={() => action('False')(false)}>False</Button>
        <Button onClick={() => action('True')(true)}>True</Button>
      </div>
    );
  });

storiesOf('Addons|Actions.deprecated', module).add('Decorated Action', () => (
  <Button onClick={pickNativeAction('decorated')}>Native Event</Button>
));
