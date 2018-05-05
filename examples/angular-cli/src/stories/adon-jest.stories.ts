import { storiesOf } from '@storybook/angular';
import { AppComponent } from '../app/app.component';
import { wTests } from '../../.storybook/withTests';

storiesOf('Addon|Jest', module)
    .addDecorator(wTests('app.component'))
    .add('app.component with jest tests', () => ({
      component: AppComponent,
      props: {},
    }));
