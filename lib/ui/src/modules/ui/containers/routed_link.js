import { RoutedLink, MenuLink } from '@storybook/components';

import genPoddaLoader from '../libs/gen_podda_loader';
import { getUrlState } from '../configs/handle_routing';
import compose from '../../../compose';

export function mapper(state, props) {
  const { url } = getUrlState({ ...state, ...props.overrideParams });

  return {
    href: url,
  };
}

const composer = compose(genPoddaLoader(mapper));

const ComposedMenuLink = composer(MenuLink);
export { ComposedMenuLink as MenuLink };

const ComposedRoutedLink = composer(RoutedLink);
export { ComposedRoutedLink as RoutedLink };
