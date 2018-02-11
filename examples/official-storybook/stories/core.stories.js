import React from 'react';
import { storiesOf, addOptions } from '@storybook/react';

const globalOption = 'globalOption';
const chapterOption = 'chapterOption';
const storyOption = 'storyOption';

addOptions({ globalOption });

storiesOf('core/options', module)
  .addOptions({ chapterOption })
  .add('passed to story', ({ options }) => <div>Options are {JSON.stringify(options)}</div>, {
    storyOption,
  });
