import React from 'react';
import PropTypes from 'prop-types';
import { withState } from 'recompose';

import { styled, withTheme } from '@storybook/theming';
import { StorybookLogo, WithTooltip, TooltipLinkList, Button, Icons } from '@storybook/components';

const BrandArea = styled.div(({ theme }) => ({
  fontSize: theme.typography.size.s2,
  fontWeight: theme.typography.weight.bold,
  '> *': {
    maxHeight: 32,
    maxWidth: 200,
    height: 'auto',
    width: 'auto',
    display: 'block',
  },
}));

const Logo = styled(StorybookLogo)({
  width: 'auto',
  height: 22,
  display: 'block',
});

const LogoLink = styled.a(
  {
    display: 'block',
    color: 'inherit',
    textDecoration: 'none',
  },
  ({ theme }) => theme.animation.hoverable
);

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
      borderRadius: 8,
      background: `${props.theme.color.positive}`,
    },
  }),
}));

const Head = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Brand = withTheme(({ theme: { brand } }) =>
  brand ? (
    <BrandArea dangerouslySetInnerHTML={{ __html: brand }} />
  ) : (
    <BrandArea>
      <LogoLink href="./">
        <Logo />
      </LogoLink>
    </BrandArea>
  )
);

const SidebarHeading = withState('tooltipShown', 'onVisibilityChange', false)(
  ({ menuHighlighted, menu, tooltipShown, onVisibilityChange, ...props }) => (
    <Head {...props}>
      <Brand />
      <WithTooltip
        placement="top"
        trigger="click"
        tooltipShown={tooltipShown}
        onVisibilityChange={onVisibilityChange}
        tooltip={
          <TooltipLinkList
            links={menu.map(i => ({
              ...i,
              onClick: (...args) => onVisibilityChange(false) || i.onClick(...args),
            }))}
          />
        }
        closeOnClick
      >
        <MenuButton outline small containsIcon highlighted={menuHighlighted}>
          <Icons icon="ellipsis" />
        </MenuButton>
      </WithTooltip>
    </Head>
  )
);
SidebarHeading.propTypes = {
  menuHighlighted: PropTypes.bool,
  menu: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

SidebarHeading.defaultProps = {
  menuHighlighted: false,
};

export { SidebarHeading as default };
