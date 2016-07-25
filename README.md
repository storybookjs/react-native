# Knobs
> A Prop Editor for react storybook

```js
import React from 'react';
import Button from './Button';
import { storiesOf, action } from '@kadira/storybook';

storiesOf('Button', module)
  .addWithKnobs('default view', (context, createKnob) => (
    <Button
      onClick={ action('button clicked') }
      color={ createKnob('color', '#fff') }
      style={ createKnob('style', { width: '50px' }, 'object') }
    >
      { createKnob('children', 'Hello') }
    </Button>
  ))
```
