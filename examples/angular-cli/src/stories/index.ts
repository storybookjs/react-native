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
  button,
} from '@storybook/addon-knobs/angular';

import { Welcome, Button } from '@storybook/angular/demo';
import { SimpleKnobsComponent } from './knobs.component';
import { AllKnobsComponent } from './all-knobs.component';
import { AppComponent } from '../app/app.component';
import { DummyService } from './moduleMetadata/dummy.service';
import { ServiceComponent } from './moduleMetadata/service.component'
import { NameComponent } from './name.component';
import { CustomPipePipe } from './custom.pipe';

storiesOf('Welcome', module)
  .add('to Storybook', () => ({
    component: Welcome,
    props: {}
  }))

storiesOf('Button', module)
  .add('with text', () => ({
    component: Button,
    props: {
      text: 'Hello Button',
      onClick: () => {}
    }
  }))
  .add('with some emoji', () => ({
    component: Button,
    props: {
      text: '😀 😎 👍 💯',
      onClick: () => {}
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
        text: 'Notes on some Button',
        onClick: () => {},
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
        text: 'Notes with HTML',
        onClick: () => {},
      }
    }))
  );


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

storiesOf('Custom ngModule metadata', module)
  .add('simple', () => ({
    component: ServiceComponent,
    props: {
      name: 'Static name'
    },
    moduleMetadata: {
      imports: [],
      schemas: [],
      declarations: [],
      providers: [DummyService]
    }
  }))
  .addDecorator(withKnobs)
  .add('with knobs', () => {
    const name = text('Name', 'Dynamic knob');

    return {
      component: ServiceComponent,
      props: {
        name
      },
      moduleMetadata: {
        imports: [],
        schemas: [],
        declarations: [],
        providers: [DummyService]
      }
    };
  });

storiesOf('Custom Pipe', module)
  .add('Default', () => ({
    component: NameComponent,
    props: {
      field: 'foobar',
    },
    moduleMetadata: {
      imports: [],
      schemas: [],
      declarations: [CustomPipePipe],
      providers: []
    }
  }));

storiesOf('Custom Pipe/With Knobs', module)
  .addDecorator(withKnobs)
  .add('NameComponent', () => ({
    component: NameComponent,
    props: {
      field: text('field', 'foobar'),
    },
    moduleMetadata: {
      imports: [],
      schemas: [],
      declarations: [CustomPipePipe],
      providers: []
    }
  }));
