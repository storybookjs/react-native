import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import TextFilter from './text_filter';

const onChange = action('onChange');
const onClear = action('onClear');
storiesOf('ui/stories/TextFilter', module)
  .add('without filterText', () => <TextFilter onChange={onChange} onClear={onClear} />)
  .add('with filterText', () => (
    <TextFilter text="Filter Text" onChange={onChange} onClear={onClear} />
  ));
