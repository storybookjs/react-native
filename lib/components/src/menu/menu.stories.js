import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled from '@emotion/styled';

import { Popout, Item, Icon, Title, Detail, List, Badge } from './menu';

const Button = styled.button({
  background: 'hotpink',
});

const FakeIcon = styled.div({
  position: 'absolute',
  height: '100%',
  width: '100%',
  background: 'orangered',
});

const MyButton = props => <Button {...props}>Click me</Button>;

storiesOf('Components|Menu', module)
  .add('initial closed', () => (
    <Popout initial="closed" trigger={MyButton}>
      Hey! well hello there
    </Popout>
  ))
  .add('initial open', () => (
    <Popout initial="open" trigger={MyButton}>
      Hey! well hello there
    </Popout>
  ))
  .add('with links', () => (
    <Popout initial="open" trigger={MyButton}>
      <a href="#!">Link</a>
    </Popout>
  ))
  .add('with Items', () => (
    <Popout initial="open" trigger={MyButton}>
      <List>
        <Item onClick={() => console.log('pressed')}>
          <Icon type={<FakeIcon />} />
          <Title>Perform an action</Title>
          <Badge>Update</Badge>
        </Item>
        <Item onClick={() => console.log('pressed')}>
          <Icon type={<FakeIcon />} />
          <Title>Perform an action</Title>
          <Detail>⌘⇧→</Detail>
        </Item>
        <Item onClick={() => console.log('pressed')}>
          <Icon type={<FakeIcon />} />
          <Title>Perform an action</Title>
          <Detail>⌘⇧→</Detail>
        </Item>
      </List>
    </Popout>
  ))
  .add('multiple open', () => (
    // Would be nice if they were mutually exclusive open
    <Fragment>
      <Popout id="1" trigger={MyButton}>
        Hey! well hello there
      </Popout>
      <Popout id="2" trigger={MyButton}>
        Hey! well hello there
      </Popout>
    </Fragment>
  ));
