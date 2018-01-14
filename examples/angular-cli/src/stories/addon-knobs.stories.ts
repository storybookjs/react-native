import { storiesOf } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import {
  withKnobs,
  text,
  number,
  boolean,
  array,
  select,
  color,
  date,
  button,
} from '@storybook/addon-knobs/angular';

import { SimpleKnobsComponent } from './knobs.component';
import { AllKnobsComponent } from './all-knobs.component';

storiesOf('Addon Knobs', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const name = text('name', 'John Doe');
    const age = number('age', 44);
    const phoneNumber = text('phoneNumber', '555-55-55');

    return {
      component: SimpleKnobsComponent,
      props: {
        name,
        age,
        phoneNumber,
      },
    };
  })
  .add('All knobs', () => {
    const name = text('name', 'Jane');
    const stock = number('stock', 20, {
      range: true,
      min: 0,
      max: 30,
      step: 5,
    });
    const fruits = {
      apples: 'Apple',
      bananas: 'Banana',
      cherries: 'Cherry',
    };
    const fruit = select('fruit', fruits, 'apple');
    const price = number('price', 2.25);

    const border = color('border', 'deeppink');
    const today = date('today', new Date('Jan 20 2017'));
    const items = array('items', ['Laptop', 'Book', 'Whiskey']);
    const nice = boolean('nice', true);
    button('Arbitrary action', action('You clicked it!'));

    return {
      component: AllKnobsComponent,
      props: {
        name,
        stock,
        fruit,
        price,
        border,
        today,
        items,
        nice,
      },
    };
  });
