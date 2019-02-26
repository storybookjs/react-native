import React from 'react';
import { styled } from '@storybook/theming';
import { storiesOf } from '@storybook/react';

import Icon from './icon';
import icons from './icons';

const Meta = styled.div({
  color: '#333',
  fontSize: 12,
});

const Item = styled.div(
  {
    display: 'inline-flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: '0 1 20%',
    minWidth: 120,

    padding: '0px 7.5px 20px',

    '& svg': {
      marginRight: 10,
      width: 24,
      height: 24,
    },
  },
  ({ minimal }) =>
    minimal
      ? {
          flex: 'none',
          minWidth: 'auto',
          padding: 0,
          background: '#fff',
          border: '1px solid #666',

          '& svg': {
            display: 'block',
            marginRight: 0,
            width: 48,
            height: 48,
          },
        }
      : {}
);

const List = styled.div({
  display: 'flex',
  flexFlow: 'row wrap',
});

const list = Object.keys(icons).sort();

storiesOf('Basics|Icon', module)
  .add('labels', () => (
    <List>
      {list.map(key => (
        <Item key={key}>
          <Icon icon={key} /> <Meta>{key}</Meta>
        </Item>
      ))}
    </List>
  ))
  .add('no labels', () => (
    <List>
      {list.map(key => (
        <Item minimal key={key}>
          <Icon icon={key} />
        </Item>
      ))}
    </List>
  ));
