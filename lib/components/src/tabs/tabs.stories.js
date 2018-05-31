import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Tabs, TabsState, panelProps, TabWrapper } from './tabs';

const colours = [...new Array(15)].map((_, i) =>
  Math.floor((1 / 15) * i * 16777215)
    .toString(16)
    .padStart(6, '0')
);

function fibonacci(num, memo = {}) {
  if (memo[num]) return memo[num];
  if (num <= 1) return 1;

  // eslint-disable-next-line no-param-reassign
  memo[num] = fibonacci(num - 1, memo) + fibonacci(num - 2, memo);
  return memo[num];
}

const panels = {
  test1: {
    title: 'Tab title #1',
    // eslint-disable-next-line react/prop-types
    render: ({ active, key }) =>
      active ? (
        <div id="test1" key={key}>
          CONTENT 1
        </div>
      ) : null,
  },
  test2: {
    title: 'Tab title #2',
    // eslint-disable-next-line react/prop-types
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
    title: 'Tab with scroll',
    // eslint-disable-next-line react/prop-types
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
    // eslint-disable-next-line react/prop-types
    render: ({ active, key }) =>
      active ? (
        <div key={key} id="test4">
          CONTENT 4
        </div>
      ) : null,
  },
  test5: {
    title: 'Tab title #5',
    // eslint-disable-next-line react/prop-types
    render: ({ active, key }) =>
      active ? (
        <div key={key} id="test5">
          CONTENT 5
        </div>
      ) : null,
  },
  test6: {
    title: 'Tab title #6',
    // eslint-disable-next-line react/prop-types
    render: ({ active, key }) => (
      <TabWrapper key={key} active={active} render={() => <div>CONTENT 6</div>} />
    ),
  },
};
panels.test1.propTypes = panelProps;
panels.test2.propTypes = panelProps;
panels.test3.propTypes = panelProps;
panels.test4.propTypes = panelProps;
panels.test5.propTypes = panelProps;
panels.test6.propTypes = panelProps;

const onPanelSelect = action('onPanelSelect');

storiesOf('Components|Tabs', module)
  .addDecorator(s => <div style={{ height: 'calc(100vh - 20px)' }}>{s()}</div>)
  .add('stateful - no initial', () => <TabsState panels={panels} />)
  .add('stateful - with initial', () => <TabsState panels={panels} initial="test2" />)
  .add('stateful - absolute', () => <TabsState panels={panels} absolute />)
  .add('stateless - default', () => (
    <Tabs panels={panels} onPanelSelect={onPanelSelect} initial="test2" />
  ))
  .add('stateless - empty', () => <Tabs panels={{}} onPanelSelect={onPanelSelect} />);
