import { RoutedLink, MenuLink } from '@storybook/components';
import { inject } from 'mobx-react';

export function mapper() {
  return {
    href: '',
  };
}

const ComposedMenuLink = inject(({ store }, props) => mapper(store, props))(MenuLink);
const ComposedRoutedLink = inject(({ store }, props) => mapper(store, props))(RoutedLink);

export { ComposedMenuLink as MenuLink };
export { ComposedRoutedLink as RoutedLink };
