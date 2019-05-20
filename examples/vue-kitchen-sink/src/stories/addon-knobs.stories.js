import { storiesOf } from '@storybook/vue';
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
} from '@storybook/addon-knobs';

const logger = console;

storiesOf('Addon|Knobs', module)
  .addDecorator(withKnobs)
  .add('Simple', () => ({
    props: {
      name: {
        type: String,
        default: text('Name', 'John Doe'),
      },
    },

    template: `<div @click="age++">I am {{ name }} and I'm {{ age }} years old.</div>`,

    data() {
      return { age: 40 };
    },

    created() {
      logger.debug('created');
    },
    destroyed() {
      logger.debug('destroyed');
    },
  }))
  .add('All knobs', () => {
    const fruits = {
      Apple: 'apples',
      Banana: 'bananas',
      Cherry: 'cherries',
    };

    button('Arbitrary action', action('You clicked it!'));

    return {
      props: {
        name: { default: text('Name', 'Jane') },
        stock: {
          default: number('Stock', 20, {
            range: true,
            min: 0,
            max: 30,
            step: 5,
          }),
        },
        fruit: { default: select('Fruit', fruits, 'apples') },
        price: { default: number('Price', 2.25) },
        colour: { default: color('Border', 'deeppink') },
        today: { default: date('Today', new Date('Jan 20 2017 GMT+0')) },
        // this is necessary, because we cant use arrays/objects directly in vue prop default values
        // a factory function is required, but we need to make sure the knob is only called once
        items: { default: (items => () => items)(array('Items', ['Laptop', 'Book', 'Whiskey'])) },
        nice: { default: boolean('Nice', true) },
      },
      data: () => ({
        dateOptions: { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' },
      }),
      computed: {
        stockMessage() {
          return this.stock
            ? `I have a stock of ${this.stock} ${this.fruit}, costing $${this.price} each.`
            : `I'm out of ${this.fruit}${this.nice ? ', Sorry!' : '.'}`;
        },
        salutation() {
          return this.nice ? 'Nice to meet you!' : 'Leave me alone!';
        },
        formattedDate() {
          return new Date(this.today).toLocaleDateString('en-US', this.dateOptions);
        },
        style() {
          return {
            'border-color': this.colour,
          };
        },
      },
      template: `
          <div style="border: 2px dotted; padding: 8px 22px; border-radius: 8px" :style="style">
            <h1>My name is {{ name }},</h1>
            <h3>today is {{ formattedDate }}</h3>
            <p>{{ stockMessage }}</p>
            <p>Also, I have:</p>
            <ul>
              <li v-for="item in items" :key="item">{{ item }}</li>
            </ul>
            <p>{{ salutation }}</p>
          </div>
        `,
    };
  })
  .add('XSS safety', () => ({
    props: {
      text: { default: text('Rendered string', '<img src=x onerror="alert(\'XSS Attack\')" >') },
    },
    template: '<div v-html="text"></div>',
  }));
