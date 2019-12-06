import { addParameters, addDecorator } from '@storybook/ember';
import { setJSONDoc } from '@storybook/addon-docs/ember';
import { withA11y } from '@storybook/addon-a11y';

/* eslint-disable import/no-unresolved */
import docJson from '../storybook-docgen/index.json';

setJSONDoc(docJson);
addDecorator(withA11y);
addParameters({
  options: {
    showRoots: true,
  },
});
