import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';

const hoc = WrapComponent => ({ ...props }) => <WrapComponent {...props} />;

const Input = hoc(() => <input type="text" />);

const TextArea = hoc(({ children }) => <textarea>{children}</textarea>);

storiesOf('GitHub issues', module).add(
  '#1814',
  withInfo('HOC')(() => (
    <div>
      <Input />
      <TextArea />
    </div>
  ))
);
