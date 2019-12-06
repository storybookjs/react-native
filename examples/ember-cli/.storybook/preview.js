import { addParameters, addDecorator } from '@storybook/ember';
import { setJSONDoc } from '@storybook/addon-docs/ember';
import { withA11y } from '@storybook/addon-a11y';
import docJson from '../dist/storybook-docgen/index.json';

setJSONDoc(docJson);
addDecorator(withA11y);
addParameters({
  options: {
    showRoots: true,
  },
});
