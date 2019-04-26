import { storiesOf } from '@storybook/angular';
import { withTests } from '@storybook/addon-jest';

import { AppComponent } from '../app/app.component';
// eslint-disable-next-line import/no-unresolved
import * as results from '../../addon-jest.testresults.json';

storiesOf('Addon|Jest', module)
  .addDecorator(
    withTests({
      results,
      filesExt: '((\\.specs?)|(\\.tests?))?(\\.ts)?$',
    })
  )
  .add(
    'app.component with jest tests',
    () => ({
      component: AppComponent,
      props: {},
    }),
    {
      jest: 'app.component',
    }
  );
