import React, { Fragment } from 'react';
import LinkTo from '@storybook/addon-links/react';

export default {
  title: 'Addons|Links.Scroll position',
  decorators: [
    storyFn => (
      <Fragment>
        <div style={{ marginBottom: '100vh' }}>Scroll down to see the link</div>
        {storyFn()}
      </Fragment>
    ),
  ],
};

export const First = () => <LinkTo story="Second">Go to Second</LinkTo>;
export const Second = () => <LinkTo story="First">Go to First</LinkTo>;
