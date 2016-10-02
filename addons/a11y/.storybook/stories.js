import React from 'react';
import { storiesOf } from '@kadira/storybook';

import { checkA11y } from './../src';

storiesOf('Button', module)
  .addDecorator(checkA11y)
  .add('Default', () => (
    <button>
      Correct Button
    </button>
  ))
  .add('Red button', () => (
    <div>
      <button style={{ backgroundColor: 'red', color: 'darkRed', }}>
        Incorrect Button
      </button>
      <button>
        Correct Button
      </button>
      <button style={{ backgroundColor: 'blue', color: 'lightBlue', height: '20px', width: '20px' }}>
      </button>
    </div>
  ));
