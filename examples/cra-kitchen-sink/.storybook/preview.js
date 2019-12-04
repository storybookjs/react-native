import { addParameters, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withA11y);
addParameters({
  options: {
    storySort: (a, b) =>
      a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, { numeric: true }),
  },
});
