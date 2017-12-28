import { storiesOf } from '@storybook/angular';
import { withKnobs, text } from '@storybook/addon-knobs/angular';
import { DiComponent } from './di.component';

storiesOf('Component dependencies', module)
  .add('inputs and inject dependencies', () => ({
    component: DiComponent,
    props: {
      title: 'Component dependencies'
    }
  }))
  .addDecorator(withKnobs)
  .add('inputs and inject dependencies with knobs', () => ({
    component: DiComponent,
    props: {
      title: text('title', 'Component dependencies')
    }
  }));

