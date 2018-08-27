import React from 'react';
import { inject } from 'mobx-react';
// import qs from 'qs';
import { Preview } from '@storybook/components';
import { Location } from '../router';

export function mapper(store) {
  // const { selectedKind, selectedStory } = store;
  // const queryString = qs.stringify({
  //   selectedKind,
  //   selectedStory,
  // });
  // const url = `iframe.html?${queryString}`;

  return {
    // url,
    channel: store.channel,
  };
}

const P = inject(({ store }) => mapper(store))(props => (
  <Preview {...props} location={`iframe.html?path=${props.location}`} />
));

export default props => (
  <Location>{({ location }) => <P location={location} {...props} />}</Location>
);
