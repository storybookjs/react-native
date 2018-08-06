import { RoutedLink, MenuLink } from '@storybook/components';

import React from 'react';

import { Consumer } from '../../../state';

// import genPoddaLoader from '../libs/gen_podda_loader';
// import { getUrlState } from '../configs/handle_routing';
// import compose from '../../../compose';

export function mapper() {
  // const { url } = getUrlState({ ...state, ...props.overrideParams });

  return {
    // href: url,
    href: '',
  };
}

// const composer = compose(
//   genPoddaLoader(mapper),
//   { withRef: false }
// );

const ComposedMenuLink = props => (
  <Consumer>
    {state => {
      const finalProps = {
        ...props,
        ...mapper(state),
      };

      return <MenuLink {...finalProps} />;
    }}
  </Consumer>
);

const ComposedRoutedLink = props => (
  <Consumer>
    {state => {
      const finalProps = {
        ...props,
        ...mapper(state),
      };

      return <RoutedLink {...finalProps} />;
    }}
  </Consumer>
);

// const ComposedMenuLink = composer(MenuLink);
export { ComposedMenuLink as MenuLink };

// const ComposedRoutedLink = composer(RoutedLink);
export { ComposedRoutedLink as RoutedLink };
