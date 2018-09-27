import React from 'react';
import { storiesOf, addParameters } from '@storybook/react';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';
import { Button } from '@storybook/components';
import { navigator } from 'global';

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

addParameters({ globalParameter });

storiesOf('Core|Parameters', module)
  .addParameters({ chapterParameter })
  .add(
    'passed to story',
    ({ parameters: { fileName, ...parameters } }) => (
      <div>
        <p>Parameters are</p>
        <pre>{JSON.stringify(parameters, null, 2)}</pre>
      </div>
    ),
    {
      storyParameter,
    }
  );

storiesOf('Core|Parameters', module)
  .addDecorator(fn => fn({ test: 'awesome' }))
  .addParameters({ chapterParameter })
  .add('adds data to storyFn', (...params) => <pre>{JSON.stringify(params, null, 2)}</pre>, {
    storyParameter,
  });

let timesClicked = 0;
const increment = () => {
  timesClicked += 1;
  addons.getChannel().emit(Events.FORCE_RE_RENDER);
};

storiesOf('Core|Events', module).add('Force re-render', () => (
  <Button onClick={increment}>Clicked: {timesClicked}</Button>
));

// Skip these stories in storyshots, they will throw -- NOTE: would rather do this
// via a params API, see https://github.com/storybooks/storybook/pull/3967#issuecomment-411616023
if (
  navigator &&
  navigator.userAgent &&
  !(navigator.userAgent.indexOf('jsdom') > -1) &&
  !(navigator.userAgent.indexOf('Chromatic') > -1)
) {
  storiesOf('Core|Errors', module)
    .add('story throws exception', () => {
      throw new Error('error');
    })
    // Story does not return something react can render
    .add('story errors', () => null);
}

import('fast-deep-equal').then(m => {
  console.log('Core|Async', m);
  storiesOf('Core|Async', module).add('story is added async', () => <div>yes</div>);
});
