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
    const name = text('Name', 'John Doe');
    const age = number('Age', 44);

    return {
      component: SimpleKnobsComponent,
      props: {
        name,
        age
      }
    };
  })
  .add('All knobs', () => {
    const name = text('Name', 'Jane');
    const stock = number('Stock', 20, {
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
    const fruit = select('Fruit', fruits, 'apple');
    const price = number('Price', 2.25);

    const border = color('Border', 'deeppink');
    const today = date('Today', new Date('Jan 20 2017'));
    const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
    const nice = boolean('Nice', true);
    button('Arbitrary action', action('You clicked it!'));

    return {
      component: AllKnobsComponent,
      props: {
        name,
        stock,
        fruits,
        fruit,
        price,
        border,
        today,
        items,
        nice
      }
    };
  });
