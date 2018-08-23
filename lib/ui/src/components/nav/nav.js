import React from 'react';
import styled from 'react-emotion';

import { Link, Match, Route } from '../../router';
import StoriesPanel from '../../containers/stories-panel';
import SettingsPanel from '../../settings/nav';

import Heading from '../heading/heading';

const Container = styled('nav')(({ theme }) => ({
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
const Inner = styled('div')({
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

const Head = styled('div')({});
const Main = styled('div')({
  flex: 1,
  marginTop: 20,
});
const Foot = styled('div')({});

const Bar = styled('ul')(({ theme }) => ({
  display: 'flex',
  margin: 0,
  padding: 0,
  borderRadius: theme.mainBorderRadius,
  overflow: 'hidden',
  background: theme.barFill,
  justifyContent: 'space-between',
  height: 40,
  marginTop: 20,
}));

const BarLi = styled('li')(({ active, theme }) => ({
  display: 'block',
  margin: 0,
  padding: 0,
  flex: 1,
  background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
  borderTop: '2px solid transparent',
  borderBottom: active ? `2px solid ${theme.highlightColor}` : '2px solid transparent',

  '& > a': {
    cursor: 'pointer',
    color: 'inherit',
    display: 'block',
    padding: 10,
    textAlign: 'center',
  },
}));

const BarItem = ({ path, children, active }) => (
  <BarLi active={active}>
    <Link to={path}>{children}</Link>
  </BarLi>
);

const Notifications = styled('ul')({
  position: 'absolute',
  display: 'block',
  bottom: 0,
  margin: 0,
  padding: 0,
  width: '100%',
  zIndex: 2,
});

const Notification = styled('li')(
  ({ level, theme }) => {
    switch (level) {
      case 0: {
        return {
          background: theme.failColor,
        };
      }
      case 1: {
        return {
          background: theme.warnColor,
        };
      }
      default: {
        return {
          background: theme.highlightColor,
        };
      }
    }
  },
  {
    margin: 0,
    padding: 0,
    display: 'flex',
    height: 50,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'black',

    '& > a': {
      color: 'inherit',
      textDecoration: 'none',
    },
  }
);
const NotificationSpacer = styled('div')({
  height: 60,
});

const A = styled('a')({
  color: 'inherit',
  textDecoration: 'none',
});

const NavLink = ({ children, path }) => (
  <Match path={path}>
    {({ match }) => (
      <BarItem active={match} path={path}>
        {children}
      </BarItem>
    )}
  </Match>
);

const Nav = ({ title, url, notifications = [] }) => (
  <Container>
    <Inner>
      <Head>
        <Heading>
          <A href={url}>{title}</A>
        </Heading>

        <Bar>
          <NavLink path="/components">Components</NavLink>
          <NavLink path="/settings/about">Settings</NavLink>
        </Bar>
      </Head>
      <Main>
        <Route path="/components" startsWith>
          <StoriesPanel />
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
);

export default Nav;
