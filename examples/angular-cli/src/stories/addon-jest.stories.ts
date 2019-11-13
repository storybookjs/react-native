import { withTests } from '@storybook/addon-jest';

import { AppComponent } from '../app/app.component';
import * as results from '../../addon-jest.testresults.json';

export default {
  title: 'Addon/Jest',
  decorators: [
    withTests({
      results,
      filesExt: '((\\.specs?)|(\\.tests?))?(\\.ts)?$',
    }),
  ],
};

export const appComponentWithJestTests = () => ({
  component: AppComponent,
  props: {},
});

appComponentWithJestTests.story = {
  name: 'app.component with jest tests',

  parameters: {
    jest: 'app.component',
  },
};
