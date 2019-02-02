import React from 'react';
import PropTypes from 'prop-types';
import { styled, withTheme } from '@storybook/theming';
import { StorybookLogo, WithTooltip, TooltipLinkList, Button, Icons } from '@storybook/components';

const BrandArea = styled.div(({ theme }) => ({
  fontSize: `${theme.typography.size.s2}px`,
  fontWeight: theme.typography.weight.bold,
}));

const Logo = styled(StorybookLogo)({
  width: 'auto',
  height: 22,
  display: 'block',
});

const LogoLink = styled.a({
  display: 'block',
  color: 'inherit',
  textDecoration: 'none',
});

const MenuButton = styled(Button)(props => ({
  position: 'relative',
  overflow: 'visible',

  ...(props.highlighted && {
    '&:after': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      width: 8,
      height: 8,
      borderRadius: 4,
      background: `${props.theme.color.positive}`,
    },
  }),
}));

const Head = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
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

export default function SidebarHeading({ menuHighlighted, menu, ...props }) {
  return (
    <Head {...props}>
      <Brand />
      <WithTooltip
        placement="top"
        trigger="click"
        tooltip={<TooltipLinkList links={menu} />}
        closeOnClick
      >
        <MenuButton outline small containsIcon highlighted={menuHighlighted}>
          <Icons icon="ellipsis" />
        </MenuButton>
      </WithTooltip>
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
