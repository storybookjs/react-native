import React from 'react';
import PropTypes from 'prop-types';
import { styled, withTheme } from '@storybook/theming';

import { StorybookLogo } from '@storybook/components';
import { createMenu, MenuToggle } from './menu';

const BrandArea = styled.div({
  flex: 1,
  marginRight: 30,
});

const Logo = styled(StorybookLogo)({
  width: 101,
  height: 20,
});

const LogoLink = styled.a({
  display: 'inline-block',
  color: 'inherit',
  textDecoration: 'none',
});

const Head = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const Brand = withTheme(({ theme: { brand } }) => (
  <BrandArea>
    {brand || (
      <LogoLink href="./">
        <Logo />
      </LogoLink>
    )}
  </BrandArea>
));

function SidebarHeader({ loading, menu: items, menuHighlighted, ...props }) {
  return (
    // TODO Use Button component
    // Use Tooltip instead of custom popout
    <Head {...props}>
      <Brand />
      <MenuToggle highlighted={menuHighlighted} id="storybook-explorer-menu">
        {createMenu(items)}
      </MenuToggle>
    </Head>
  );
}

SidebarHeader.propTypes = {
  loading: PropTypes.bool,
  menu: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
      action: PropTypes.func.isRequired,
      detail: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
      icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    })
  ).isRequired,
  menuHighlighted: PropTypes.bool.isRequired,
};

SidebarHeader.defaultProps = {
  loading: false,
};

export default SidebarHeader;
