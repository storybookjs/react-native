import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Spaced, Logo } from '@storybook/components';
import { styled, withTheme } from '@storybook/theming';

import {
  Notification,
  NotificationLink,
  Notifications,
  NotificationSpacer,
  NotificationText,
  NotificationIcon,
} from './notifications';
import { createMenu, MenuToggle } from './menu';

import { StoriesExplorer } from './explorer';

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

const Container = styled.nav(({ theme }) => ({
  background: theme.asideFill,
  position: 'absolute',
  zIndex: 1,
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
}));

const Inner = styled.div({
  position: 'absolute',
  zIndex: 1,
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'stretch',
  padding: 20,
  overflow: 'auto',
  minHeight: '100%',
  boxSizing: 'border-box',
});

const Foot = styled.div({});

const Brand = withTheme(({ theme: { brand } }) => (
  <BrandArea>
    {brand || (
      <LogoLink href="./">
        <StorybookLogo />
      </LogoLink>
    )}
  </BrandArea>
));

const Nav = ({ storyId, notifications = [], stories, menu: items, menuHighlighted }) => (
  <Container>
    <Inner>
      <Spaced row={2}>
        <Head>
          <Brand />
          <MenuToggle highlighted={menuHighlighted} id="storybook-explorer-menu">
            {createMenu(items)}
          </MenuToggle>
        </Head>
        <StoriesExplorer stories={stories} storyId={storyId} />
      </Spaced>
      <Foot>
        {notifications.map(({ id }) => (
          <NotificationSpacer key={id} />
        ))}
      </Foot>
    </Inner>
    {notifications.length ? (
      <Notifications>
        {notifications.map(({ id, icon, content, level, link }) =>
          link ? (
            <NotificationLink to={link} key={id} level={level}>
              {icon ? (
                <Fragment>
                  <NotificationIcon>{icon}</NotificationIcon>
                  <NotificationText>{content}</NotificationText>
                </Fragment>
              ) : (
                <NotificationText>{content}</NotificationText>
              )}
            </NotificationLink>
          ) : (
            <Notification key={id} level={level}>
              {icon ? (
                <Fragment>
                  <NotificationIcon>{icon}</NotificationIcon>
                  <NotificationText>{content}</NotificationText>
                </Fragment>
              ) : (
                <NotificationText>{content}</NotificationText>
              )}
            </Notification>
          )
        )}
      </Notifications>
    ) : null}
  </Container>
);

Nav.propTypes = {
  stories: PropTypes.shape({}).isRequired,
  storyId: PropTypes.string,
  notifications: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
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
Nav.defaultProps = {
  storyId: undefined,
};
Nav.displayName = 'Nav';

export default Nav;
