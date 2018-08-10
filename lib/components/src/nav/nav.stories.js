import React from 'react';
import styled from 'react-emotion';
import { storiesOf } from '@storybook/react';

import { Nav } from './nav';

const SearchBox = styled('input')({
  display: 'block',
  padding: 10,
  boxSizing: 'border-box',
  borderRadius: 5,
  height: 40,
  width: '100%',
  margin: 0,
  border: '0 none',
});

const List = styled('div')({
  display: 'block',
  marginTop: 10,
});

const sections = [
  {
    name: 'components',
    id: 'components',
    render: () => (
      <div>
        <SearchBox placeholder="search" />
        <List>LIST GOES HERE</List>
      </div>
    ),
    active: true,
  },
  { name: 'settings', render: () => <div>Settings NAV</div>, active: false },
];

const notifications = [
  {
    content: 'happy birthday',
    id: 'birthday',
  },
];

storiesOf('Components|Nav', module).add('default', () => (
  <Nav
    title="My storybook"
    url="https://example.com"
    components={[]}
    notifications={notifications}
    sections={sections}
  />
));
