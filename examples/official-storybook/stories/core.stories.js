import React from 'react';
import { storiesOf, addParameters } from '@storybook/react';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';
import { Button } from '@storybook/components';

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

addParameters({ globalParameter });

storiesOf('Core|Parameters', module)
  .addParameters({ chapterParameter })
  .add(
    'passed to story',
    ({ parameters: { fileName, ...parameters } }) => (
      <div>Parameters are {JSON.stringify(parameters)}</div>
    ),
    {
      storyParameter,
    }
  );

const forceReRender = () => addons.getChannel().emit(Events.FORCE_RE_RENDER);

storiesOf('Core|Events', module).add('Force re-render', () => (
  <React.Fragment>
    Random number is {Math.random()} <Button onClick={forceReRender}>Refresh</Button>
  </React.Fragment>
));
