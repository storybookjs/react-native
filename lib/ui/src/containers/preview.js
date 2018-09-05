import React from 'react';
import { inject } from 'mobx-react';
import { Preview } from '@storybook/components';
import { Location } from '../router';

export function mapper(store) {
  return {
    channel: store.channel,
  };
}

const P = inject(({ store }) => mapper(store))(
  ({ location, ...props }) =>
    console.log('P') || <Preview {...props} location={`iframe.html?path=${location}`} />
);

export default props => (
  <Location>
    {({ location }) => {
      console.log({ location });
      return <P location={location} {...props} />;
    }}
  </Location>
);
