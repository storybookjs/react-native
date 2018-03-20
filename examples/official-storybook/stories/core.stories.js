import React from 'react';
import { storiesOf, addParameters } from '@storybook/react';

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
