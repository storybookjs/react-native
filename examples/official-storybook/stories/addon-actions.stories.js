import { window, File } from 'global';
import React, { Fragment } from 'react';
import {
  action,
  actions,
  configureActions,
  decorate,
  decorateAction,
} from '@storybook/addon-actions';
import { Form } from '@storybook/components';

const { Button } = Form;

const pickNative = decorate([args => [args[0].nativeEvent]]);
const pickNativeAction = decorateAction([args => [args[0].nativeEvent]]);

export default {
  title: 'Addons/Actions',
  parameters: {
    options: {
      selectedPanel: 'storybook/actions/panel',
    },
  },
};

export const BasicExample = () => <Button onClick={action('hello-world')}>Hello World</Button>;

BasicExample.story = {
  name: 'Basic example',
};

export const MultipleActions = () => (
  <Button {...actions('onClick', 'onMouseOver')}>Hello World</Button>
);

MultipleActions.story = {
  name: 'Multiple actions',
};

export const MultipleActionsConfig = () => (
  <Button {...actions('onClick', 'onMouseOver', { clearOnStoryChange: false })}>
    Moving away from this story will persist the action logger
  </Button>
);

MultipleActionsConfig.story = {
  name: 'Multiple actions + config',
};

export const MultipleActionsAsObject = () => (
  <Button {...actions({ onClick: 'clicked', onMouseOver: 'hovered' })}>Hello World</Button>
);

MultipleActionsAsObject.story = {
  name: 'Multiple actions as object',
};

export const MultipleActionsObjectConfig = () => (
  <Button
    {...actions({ onClick: 'clicked', onMouseOver: 'hovered' }, { clearOnStoryChange: false })}
  >
    Moving away from this story will persist the action logger
  </Button>
);

MultipleActionsObjectConfig.story = {
  name: 'Multiple actions, object + config',
};

export const DecoratedAction = () => (
  <Button onClick={pickNative.action('decorated')}>Native Event</Button>
);

DecoratedAction.story = {
  name: 'Decorated action',
};

export const DecoratedActionConfig = () => (
  <Button onClick={pickNative.action('decorated', { clearOnStoryChange: false })}>
    Moving away from this story will persist the action logger
  </Button>
);

DecoratedActionConfig.story = {
  name: 'Decorated action + config',
};

export const DecoratedActions = () => (
  <Button {...pickNative.actions('onClick', 'onMouseOver')}>Native Event</Button>
);

DecoratedActions.story = {
  name: 'Decorated actions',
};

export const DecoratedActionsConfig = () => (
  <Button {...pickNative.actions('onClick', 'onMouseOver', { clearOnStoryChange: false })}>
    Moving away from this story will persist the action logger
  </Button>
);

DecoratedActionsConfig.story = {
  name: 'Decorated actions + config',
};

export const CircularPayload = () => {
  const circular = { foo: {} };
  circular.foo.circular = circular;
  return <Button onClick={() => action('circular')(circular)}>Circular Payload</Button>;
};

CircularPayload.story = {
  name: 'Circular Payload',
};

export const ReservedKeywordAsName = () => <Button onClick={action('delete')}>Delete</Button>;

ReservedKeywordAsName.story = {
  name: 'Reserved keyword as name',
};

export const AllTypes = () => {
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
    <Fragment>
      <Button onClick={() => action('Array')(['foo', 'bar', { foo: 'bar' }])}>Array</Button>
      <Button onClick={() => action('Boolean')(false)}>Boolean</Button>
      <Button onClick={() => action('Empty Object')({})}>Empty Object</Button>
      <Button onClick={() => action('File')(file)}>File</Button>
      <Button onClick={() => action('Function', { allowFunction: true })(A)}>Function A</Button>
      <Button onClick={() => action('Function (bound)', { allowFunction: true })(bound)}>
        Bound Function B
      </Button>
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
    </Fragment>
  );
};

AllTypes.story = {
  name: 'All types',
};

export const ConfigureActionsDepth = () => {
  configureActions({
    depth: 2,
  });

  return (
    <Button onClick={() => action('ConfiguredDepth')({ root: { one: { two: { three: 'foo' } } } })}>
      Object (configured depth: 2)
    </Button>
  );
};

export const PersistingTheActionLogger = () => (
  <Fragment>
    <p>Moving away from this story will persist the action logger</p>
    <Button onClick={action('clear-action-logger', { clearOnStoryChange: false })}>
      Object (configured clearOnStoryChange: false)
    </Button>
  </Fragment>
);

PersistingTheActionLogger.story = {
  name: 'Persisting the action logger',
};

export const LimitActionOutput = () => {
  configureActions({
    limit: 2,
  });

  return (
    <Fragment>
      <Button onClick={() => action('False')(false)}>False</Button>
      <Button onClick={() => action('True')(true)}>True</Button>
    </Fragment>
  );
};
LimitActionOutput.story = {
  name: 'Limit Action Output',
};
