import React from 'react';
import styled, { css } from 'styled-components';

import { GlobalStyle } from '../basics/shared/global';
import { Link, Icon, TooltipLinkList, WithTooltip, styles, site } from '../basics';
import { navLinks } from './PageLayout';

const { color, typography, spacing, breakpoint } = styles;
const { metadata, url } = site;

const LogotypeWrapper = styled.a`
  display: inline-block;
  img {
    height: 22px;
    width: auto;
    margin-top: 14px;
    @media (min-width: ${breakpoint}px) {
      height: 26px;
      margin-top: 10px;
    }

    display: block;
  }
`;

const Version = styled(Link)`
  display: inline-block;
  vertical-align: top;
  margin-left: 10px;
  position: relative;
  top: 2px;
  font-size: ${typography.size.s1}px;
  color: ${color.mediumdark};
`;

const TooltipLinkListWrapper = styled.div`
  padding: 8px 5px;
  color: ${color.darkest};
`;

const NavLink = styled(Link)`
  font-size: ${typography.size.s2}px;
  font-weight: ${typography.weight.bold};
`;

const Menu = styled(Link)`
  width: 3rem;
  height: 3rem;
  border: none !important;
  text-decoration: none !important;
  background: none !important;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  svg {
    vertical-align: top;
    height: 1rem;
    width: 1rem;
    margin: 0;
  }
`;

const MobileMenu = styled.div`
  font-size: ${typography.size.s1}px;

  ${TooltipLinkListWrapper} {
    padding: 5px 0;
  }
`;

const NavItem = styled.div`
  display: inline-block;
  line-height: 3rem;
  height: 3rem;
  vertical-align: top;

  ${props =>
    props.showDesktop &&
    css`
      display: none;
      @media (min-width: ${breakpoint * 1.333}px) {
        display: inline-block;
      }
    `};

  ${props =>
    props.showMobile &&
    css`
      @media (min-width: ${breakpoint * 1.333}px) {
        display: none;
      }
    `};
`;

const NavGroup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;

  ${props =>
    props.right &&
    css`
      left: auto;
      right: 0;
    `}

  ${NavItem} + ${NavItem} {
    margin-left: ${spacing.padding.large}px;
  }
`;

const Nav = styled.div`
  height: 3rem;
  position: relative;
  text-align: center;
  z-index: 3;
  display: flex;
`;

const NavWrapper = styled.nav`
  padding-top: 12px;
  @media (min-width: ${breakpoint}px) {
    padding-top: 36px;
  }
`;

export default function Header({ ...props }) {
  const mobileMenu = (
    <MobileMenu>
      <TooltipLinkList links={navLinks} />
    </MobileMenu>
  );

  return (
    <NavWrapper {...props}>
      <GlobalStyle />

      <Nav>
        <NavGroup>
          <NavItem>
            <LogotypeWrapper href="/">
              <img src="https://storybook.js.org/images/logos/logo-storybook.svg" alt="Storybook" />
            </LogotypeWrapper>
            <Version href={url.gitHub.releases}>{metadata.latestVersion}</Version>
          </NavItem>
        </NavGroup>

        <NavGroup right>
          {navLinks.map(({ title, href, isGatsby }) => (
            <NavItem showDesktop key={title}>
              <NavLink
                tertiary={1}
                href={!isGatsby ? href : undefined}
                to={isGatsby ? href : undefined}
                isGatsby={isGatsby}
              >
                {title}
              </NavLink>
            </NavItem>
          ))}

          <NavItem showMobile>
            <WithTooltip placement="top" trigger="click" tooltip={mobileMenu}>
              <Menu secondary icon={1} isButton>
                <Icon icon="menu" />
              </Menu>
            </WithTooltip>
          </NavItem>
        </NavGroup>
      </Nav>
    </NavWrapper>
  );
}
