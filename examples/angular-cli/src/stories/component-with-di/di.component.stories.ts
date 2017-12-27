import {storiesOf} from '@storybook/angular';
import {DiComponent} from './di.component';

storiesOf('Component dependencies', module)
  .add('inputs and inject dependencies', () => ({
    component: DiComponent,
    props: {
      title: 'Component dependencies'
    }
  }));
