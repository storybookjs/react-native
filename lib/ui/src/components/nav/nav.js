import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { withCSSContext } from '@emotion/core';

import { Heading } from '@storybook/components';

import { Notification, Notifications, NotificationSpacer } from './notifications';
import { Bar, BarItem } from './bar';

import { Link, Match, Route } from '../../router';
import { StoriesPanel } from './explorer';
import SettingsPanel from '../../settings/nav';

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
  padding: 10,
  overflow: 'auto',
  minHeight: '100%',
  boxSizing: 'border-box',
});

const Head = styled.div({});
const Main = styled.div({
  flex: 1,
  marginTop: 20,
});
const Foot = styled.div({});

const A = styled.a({
  color: 'inherit',
  textDecoration: 'none',
});

const NavLink = ({ children, path }) => (
  <Match path={path} startsWith>
    {({ match }) => (
      <BarItem active={!!match} path={path}>
        {children}
      </BarItem>
    )}
  </Match>
);
NavLink.propTypes = {
  children: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
};

const Brand = styled.div(props => props);

const Nav = withCSSContext(
  (
    {
      title,
      url,
      notifications = [],
      stories,
      componentsUrl,
      hierarchyRootSeparator,
      hierarchySeparator,
    },
    { theme }
  ) => (
    <Container>
      <Inner>
        <Head>
          {theme.brand ? (
            <A href={url}>
              <Brand {...theme.brand} />
            </A>
          ) : (
            <Heading>
              <A href={url}>{title}</A>
            </Heading>
          )}
          <Bar>
            <NavLink path={componentsUrl}>Components</NavLink>
            <NavLink path="/settings">Settings</NavLink>
          </Bar>
        </Head>
        <Main>
          <Route path="/components" startsWith>
            <StoriesPanel {...{ stories, hierarchyRootSeparator, hierarchySeparator }} />
          </Route>
          <Route path="/settings" startsWith>
            <SettingsPanel />
          </Route>
        </Main>
        <Foot>
          {notifications.map(({ id }) => (
            <NotificationSpacer key={id} />
          ))}
        </Foot>
      </Inner>
      {notifications.length ? (
        <Notifications>
          {notifications.map(({ id, content, level, link }) => (
            <Notification key={id} level={level}>
              {link ? <Link to={link}>{content}</Link> : content}
            </Notification>
          ))}
        </Notifications>
      ) : null}
    </Container>
  )
);
Nav.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  stories: PropTypes.shape({}).isRequired,
  notifications: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Nav;
