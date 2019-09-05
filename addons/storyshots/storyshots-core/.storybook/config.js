import { configure } from '@storybook/react';

configure(
  [
    require.context('../stories/required_with_context', false, /\.stories\.js$/),
    require.context('../stories/directly_required', false, /index\.js$/),
  ],
  module
);
