# Knobs
> A Prop Editor for react storybook

![usage](usage.gif)

## API

Use function `createKnob` passed to your stories to create a *knob* for a prop.

`createKnob(name, initialValue, type)`  

* `name`: Should uniquely idintify the prop. Used as the label of the knob
* `initialValue`: Value used when first rendered
* `type`: Optionally specify a type for the prop. Decides the input type of the knob. Currently the string 'object' is identified and it gives knob a textarea input that will be `eval`ed for an object. By default shows a text input.


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
