import { storiesOf } from '@storybook/angular';

import { withNotes } from '@storybook/addon-notes';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import {
  withKnobs,
  text,
  number,
  boolean,
  array,
  select,
  color,
  date,
} from '@storybook/addon-knobs';

import { Welcome, Button } from '@storybook/angular/demo';
import { SimpleKnobsComponent } from './knobs.component';

import { AppComponent } from '../app/app.component';

storiesOf('Welcome', module)
  .add('to Storybook', () => ({
    component: Welcome,
    props: {}
  }))

storiesOf('Button', module)
  .add('with text', () => ({
    component: Button,
    props: {
      text: 'Hello Button'
    }
  }))
  .add('with some emoji', () => ({
    component: Button,
    props: {
      text: '😀 😎 👍 💯'
    }
  }))

storiesOf('Another Button', module)
  .add('button with link to another story', () => ({
    component: Button,
    props: {
      text: 'Go to Welcome Story',
      onClick: linkTo('Welcome')
    }
  }))

storiesOf('App Component', module)
  .add('Component with separate template', () => ({
    component: AppComponent,
    props: {}
  }))

storiesOf('Addon Actions', module)
  .add('Action only', () => ({
    component: Button,
    props: {
      text: 'Action only',
      onClick: action('log 1')
    }
  }))
  .add('Action and method', () => ({
    component: Button,
    props: {
      text: 'Action and Method',
      onClick: e => {
        console.log(e);
        e.preventDefault();
        action('log2')(e.target);
      }
    }
  }));

storiesOf('Addon Notes', module)
  .add(
    'Simple note',
    withNotes({ text: 'My notes on some button' })(() => ({
      component: Button,
      props: {
        text: 'Notes on some Button'
      }
    }))
  )
  .add(
    'Note with HTML',
    withNotes({
      text: `
      <h2>My notes on emojis</h2>

      <em>It's not all that important to be honest, but..</em>

      Emojis are great, I love emojis, in fact I like using them in my Component notes too! 😇
    `,
    })(() => ({
      component: Button,
      props: {
        text: 'Notes with HTML'
      }
    }))
  );


storiesOf('Addon Knobs', module)
  .addDecorator(withKnobs)
  .add('Simple', () => {
    const name = text('Name', 'John Doe');
    const age = number('Age', 44);
    const content = `I am ${name} and I'm ${age} years old.`;

    return {
      component: SimpleKnobsComponent,
      props: {
        content
      }
    };
  })
  // .add('All knobs', () => {
  //   const name = text('Name', 'Jane');
  //   const stock = number('Stock', 20, {
  //     range: true,
  //     min: 0,
  //     max: 30,
  //     step: 5,
  //   });
  //   const fruits = {
  //     apples: 'Apple',
  //     bananas: 'Banana',
  //     cherries: 'Cherry',
  //   };
  //   const fruit = select('Fruit', fruits, 'apple');
  //   const price = number('Price', 2.25);

  //   const colour = color('Border', 'deeppink');
  //   const today = date('Today', new Date('Jan 20 2017'));
  //   const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
  //   const nice = boolean('Nice', true);

  //   const stockMessage = stock
  //     ? `I have a stock of ${stock} ${fruit}, costing &dollar;${price} each.`
  //     : `I'm out of ${fruit}${nice ? ', Sorry!' : '.'}`;
  //   const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';

  //   return {
  //     template: `
  //         <div style="border:2px dotted ${colour}; padding: 8px 22px; border-radius: 8px">
  //           <h1>My name is ${name},</h1>
  //           <h3>today is ${new Date(today).toLocaleDateString()}</h3>
  //           <p>${stockMessage}</p>
  //           <p>Also, I have:</p>
  //           <ul>
  //             ${items.map(item => `<li key=${item}>${item}</li>`).join('')}
  //           </ul>
  //           <p>${salutation}</p>
  //         </div>
  //       `,
  //   };
  // });
