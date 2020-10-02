import { addParameters, storiesOf } from '@storybook/react-native';
import React from 'react';
import { Text } from 'react-native';

const globalParameter = 'globalParameter';
const chapterParameter = 'chapterParameter';
const storyParameter = 'storyParameter';

addParameters({ globalParameter });

storiesOf('Core|Parameters', module)
  .addParameters({ chapterParameter })
  .add(
    'passed to story',
    ({ parameters }) => <Text>Parameters are {JSON.stringify(parameters)}</Text>,
    {
      storyParameter,
    }
  );
