import deprecate from 'util-deprecate';
import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';

deprecate(() => {},
'@storybook/react/addons is deprecated. See https://storybook.js.org/addons/using-addons/')();
