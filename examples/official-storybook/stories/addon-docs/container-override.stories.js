import React from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';

export default {
  title: 'Addons/Docs/container-override',
  parameters: {
    docs: {
      // eslint-disable-next-line react/prop-types
      container: ({ children, context }) => (
        <DocsContainer context={context}>
          <div style={{ border: '5px solid red' }}>{children}</div>
        </DocsContainer>
      ),
    },
  },
};

export const dummy = () => <div>some content</div>;
