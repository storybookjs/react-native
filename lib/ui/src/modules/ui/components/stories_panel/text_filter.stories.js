import React from 'react';
import { storiesOf } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions'; // eslint-disable-line import/no-extraneous-dependencies

import TextFilter from './text_filter';

const onChange = action('onChange');
const onClear = action('onClear');
storiesOf('UI|stories/TextFilter', module)
  .add('without filterText', () => <TextFilter onChange={onChange} onClear={onClear} />)
  .add('with filterText', () => (
    <TextFilter text="Filter Text" onChange={onChange} onClear={onClear} />
  ));
