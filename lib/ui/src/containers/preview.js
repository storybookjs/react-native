import React from 'react';
import { inject } from 'mobx-react';
import { Preview } from '@storybook/components';
import { Location } from '../router';

export function mapper(store) {
  return {
    channel: store.channel,
  };
}

const P = inject(({ store }) => mapper(store))(({ location, ...props }) => (
  <Preview {...props} location={`iframe.html?path=${location}`} />
));

export default props =>
  console.log({ props }) || (
    <Location>{({ location }) => <P location={location} {...props} />}</Location>
  );
