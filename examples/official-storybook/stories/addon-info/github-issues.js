import React from 'react';
import { withInfo } from '@storybook/addon-info';

const hoc = WrapComponent => ({ ...props }) => <WrapComponent {...props} />;

const Input = hoc(() => <input type="text" />);

const TextArea = hoc(({ children }) => <textarea>{children}</textarea>);

export default {
  title: 'Addons|Info/GitHub issues',
  decorators: [withInfo],
};

export const issue1814 = () => (
  <div>
    <Input />
    <TextArea />
  </div>
);

issue1814.story = {
  name: '#1814',
  parameters: {
    info: 'Allow Duplicate DisplayNames for HOC #1814',
  },
};
