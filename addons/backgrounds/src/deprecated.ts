import deprecate from 'util-deprecate';

import backgrounds from '.';

export default deprecate(
  backgrounds,
  "addon-backgrounds: framework-specific imports are deprecated, just use `import backgrounds from '@storybook/addon-backgrounds`"
);
