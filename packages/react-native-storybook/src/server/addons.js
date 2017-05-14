import deprecate from 'util-deprecate';
import '@kadira/storybook-addon-actions/register';
import '@kadira/storybook-addon-links/register';

deprecate(
  () => {},
  '@kadira/react-native-storybook/addons is deprecated. See https://storybooks.js.org/docs/react-storybook/addons/using-addons/',
)();
