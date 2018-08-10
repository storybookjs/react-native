import React from 'react';
import { inject } from 'mobx-react';
// import { AddonPanel } from '@storybook/components';

export function mapper(store) {
  return {
    Preview: store.Preview,
  };
}

export default inject(({ store }, props) => mapper(store, props))(({ Preview }) => <Preview />);
