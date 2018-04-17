import { storiesOf } from '@storybook/angular';
import { AppComponent } from '../app/app.component';

storiesOf('App Component', module).add('Component with separate template', () => ({
  component: AppComponent,
  props: {},
}));
