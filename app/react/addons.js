import deprecate from 'util-deprecate';
import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';

deprecate(
  () => {},
  '@storybook/react/addons is deprecated. See https://storybooks.js.org/docs/react-storybook/addons/using-addons/',
)();
