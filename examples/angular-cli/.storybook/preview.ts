import { addParameters, addDecorator } from '@storybook/angular';
import { withA11y } from '@storybook/addon-a11y';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import addCssWarning from '../src/cssWarning';

// @ts-ignore
// eslint-disable-next-line import/extensions, import/no-unresolved
import docJson from '../documentation.json';

setCompodocJson(docJson);

addDecorator(withA11y);
addCssWarning();

addParameters({
  docs: {
    // inlineStories: true,
    iframeHeight: '60px',
  },
});
