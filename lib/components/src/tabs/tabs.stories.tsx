import React, { Fragment, Key } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { logger } from '@storybook/client-logger';

import { Tabs, TabsState, TabWrapper } from './tabs';

const colours = Array.from(new Array(15), (val, index) => index).map(i =>
  Math.floor((1 / 15) * i * 16777215)
    .toString(16)
    .padStart(6, '0')
);

interface FibonacciMap {
  [key: string]: number;
}

function fibonacci(num: number, memo?: FibonacciMap): number {
  /* eslint-disable no-param-reassign */
  if (!memo) {
    memo = {};
  }
  if (memo[num]) {
    return memo[num];
  }
  if (num <= 1) {
    return 1;
  }

  memo[num] = fibonacci(num - 1, memo) + fibonacci(num - 2, memo);
  return memo[num];
  /* eslint-enable no-param-reassign */
}

interface Panels {
  [key: string]: {
    title: string;
    render: ({ active, key }: { active: boolean; key: Key }) => JSX.Element;
  };
}

const panels: Panels = {
  test1: {
    title: 'Tab title #1',
    render: ({ active, key }) =>
      active ? (
        <div id="test1" key={key}>
          CONTENT 1
        </div>
      ) : null,
  },
  test2: {
    title: 'Tab title #2',
    render: ({ active, key }) => (
      <div
        key={key}
        id="test2"
        style={{ background: 'hotpink', minHeight: '100%', display: active ? 'block' : 'none' }}
      >
        CONTENT 2
      </div>
    ),
  },
  test3: {
    title: 'Tab with scroll!',
    render: ({ active, key }) =>
      active ? (
        <div id="test3" key={key}>
          {colours.map((colour, i) => (
            <div
              key={colour}
              style={{
                background: `#${colour}`,
                height: 30 + fibonacci(i + 5) / 10,
              }}
            />
          ))}
        </div>
      ) : null,
  },
  test4: {
    title: 'Tab title #4',
    render: ({ active, key }) =>
      active ? (
        <div key={key} id="test4">
          CONTENT 4
        </div>
      ) : null,
  },
  test5: {
    title: 'Tab title #5',
    render: ({ active, key }) =>
      active ? (
        <div key={key} id="test5">
          CONTENT 5
        </div>
      ) : null,
  },
  test6: {
    title: 'Tab title #6',
    render: ({ active, key }) => (
      <TabWrapper key={key} active={active} render={() => <div>CONTENT 6</div>} />
    ),
  },
};

const onSelect = action('onSelect');

const content = Object.entries(panels).map(([k, v]) => (
  <div key={k} id={k} title={v.title}>
    {v.render}
  </div>
));

storiesOf('Basics|Tabs', module)
  .addDecorator(s => (
    <div
      style={{
        position: 'relative',
        height: 'calc(100vh - 20px)',
        width: 'calc(100vw - 20px)',
        margin: 10,
      }}
    >
      {s()}
    </div>
  ))
  .add('stateful - static', () => (
    <TabsState initial="test2">
      <div id="test1" title="With a function">
        {({ active, selected }: { active: boolean; selected: string }) =>
          active ? <div>{selected} is selected</div> : null
        }
      </div>
      <div id="test2" title="With markup">
        <div>test2 is always active (but visually hidden)</div>
      </div>
    </TabsState>
  ))
  .add('stateful - dynamic', () => (
    <TabsState initial="test3">
      {Object.entries(panels).map(([k, v]) => (
        <div key={k} id={k} title={v.title}>
          {v.render}
        </div>
      ))}
    </TabsState>
  ))
  .add('stateful - no initial', () => <TabsState>{content}</TabsState>)
  .add('stateless - bordered', () => (
    <Tabs bordered absolute={false} selected="test3" actions={{ onSelect }}>
      {content}
    </Tabs>
  ))
  .add('stateless - with tools', () => (
    <Tabs
      selected="test3"
      actions={{ onSelect }}
      tools={
        <Fragment>
          <button type="button" onClick={() => logger.log('1')}>
            1
          </button>
          <button type="button" onClick={() => logger.log('2')}>
            2
          </button>
        </Fragment>
      }
    >
      {content}
    </Tabs>
  ))
  .add('stateless - absolute', () => (
    <Tabs bordered absolute selected="test3" actions={{ onSelect }}>
      {content}
    </Tabs>
  ))
  .add('stateless - empty', () => <Tabs actions={{ onSelect }} bordered absolute />);
