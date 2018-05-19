import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Tabs, { TabsState, panelProps } from './tabs';

const colours = [...new Array(15)].map((_, i) =>
  Math.floor(1 / 15 * i * 16777215)
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
    render: ({ hidden }) => (hidden ? null : <div id="test1">CONTENT 1</div>),
  },
  test2: {
    title: 'Tab title #2',
    // eslint-disable-next-line react/prop-types
    render: ({ hidden }) => (
      <div
        id="test2"
        style={{ background: 'hotpink', minHeight: '100%', display: hidden ? 'none' : 'block' }}
      >
        CONTENT 2
      </div>
    ),
  },
  test3: {
    title: 'Tab with scroll',
    // eslint-disable-next-line react/prop-types
    render: ({ hidden }) =>
      hidden ? null : (
        <div id="test3">
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
      ),
  },
  test4: {
    title: 'Tab title #4',
    // eslint-disable-next-line react/prop-types
    render: ({ hidden }) => (hidden ? null : <div id="test1">CONTENT 4</div>),
  },
  test5: {
    title: 'Tab title #5',
    // eslint-disable-next-line react/prop-types
    render: ({ hidden }) => (hidden ? null : <div id="test1">CONTENT 5</div>),
  },
  test6: {
    title: 'Tab title #6',
    // eslint-disable-next-line react/prop-types
    render: ({ hidden }) => (hidden ? null : <div id="test1">CONTENT 6</div>),
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
  .add('statefull - no initial', () => <TabsState panels={panels} />)
  .add('statefull - with initial', () => <TabsState panels={panels} initial="test2" />)
  .add('statefull - absolute', () => <TabsState panels={panels} absolute />)
  .add('stateless - default', () => <Tabs panels={panels} onPanelSelect={onPanelSelect} />)
  .add('stateless - empty', () => <Tabs panels={{}} onPanelSelect={onPanelSelect} />);
