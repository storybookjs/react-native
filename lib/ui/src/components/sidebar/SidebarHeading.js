import React from 'react';
import PropTypes from 'prop-types';
import { styled, withTheme } from '@storybook/theming';
import { Logo } from '@storybook/components';

import Menu from '../menu/Menu';

const BrandArea = styled.div({
  flex: 1,
  marginRight: 30,
});

const StorybookLogo = styled(Logo)({
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
        <StorybookLogo />
      </LogoLink>
    )}
  </BrandArea>
));

export default function SidebarHeading({ menuHighlighted, menu }) {
  return (
    <Head>
      <Brand />
      <Menu highlighted={menuHighlighted} menuItems={menu} />
    </Head>
  );
}

SidebarHeading.propTypes = {
  menuHighlighted: PropTypes.bool,
  menu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

SidebarHeading.defaultProps = {
  menuHighlighted: false,
};
