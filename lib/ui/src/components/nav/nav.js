import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { withCSSContext } from '@emotion/core';

import { Heading } from '@storybook/components';

import { Notification, Notifications, NotificationSpacer } from './notifications';
import { Menu, MenuToggle } from './menu';

import { Link } from '../../router';
import { StoriesPanel } from './explorer';

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

const Head = styled.div({
  display: 'flex',
  alignItems: 'center',
  height: 20,
  marginRight: -10,
});
const Main = styled.div({
  flex: 1,
  marginTop: 20,
});
const Foot = styled.div({});

const A = styled.a({
  color: 'inherit',
  textDecoration: 'none',
});
const HeadMain = styled.div({
  flex: 1,
  marginRight: 30,
});

const Brand = styled.div(props => props);

const Nav = withCSSContext(({ title, url, notifications = [], stories, menu }, { theme }) => (
  <Container>
    <Inner>
      <Head>
        <HeadMain>
          {theme.brand ? (
            <A href={url}>
              <Brand {...theme.brand} />
            </A>
          ) : (
            <Heading>
              <A href={url}>{title}</A>
            </Heading>
          )}
        </HeadMain>
        <MenuToggle>
          <Menu items={menu} />
        </MenuToggle>
      </Head>
      <Main>
        {/* <Route path="/components" startsWith> */}
        <StoriesPanel stories={stories} />
        {/* </Route> */}
        {/* <Route path="/settings" startsWith>
          <SettingsPanel />
        </Route> */}
      </Main>
      <Foot>
        {notifications.map(({ id }) => (
          <NotificationSpacer key={id} />
        ))}
      </Foot>
    </Inner>
    {notifications.length ? (
      <Notifications>
        {notifications.map(
          ({ id, content, level, link }) =>
            link ? (
              <Link to={link}>
                <Notification key={id} level={level}>
                  {content}
                </Notification>
              </Link>
            ) : (
              <Notification key={id} level={level}>
                content
              </Notification>
            )
        )}
      </Notifications>
    ) : null}
  </Container>
));
Nav.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  stories: PropTypes.shape({}).isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  menu: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
      actions: PropTypes.func.isRequired,
      detail: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
      icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    })
  ),
};

export default Nav;
