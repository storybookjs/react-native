import React, { Fragment } from 'react';
import { logger } from '@storybook/client-logger';
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
    <Popout>
      <MyButton />
      <div>Hey! well hello there</div>
    </Popout>
  ))
  .add('initial open', () => (
    <Popout defaultOpen>
      <MyButton />
      <div>Hey! well hello there</div>
    </Popout>
  ))
  .add('with links', () => (
    <Popout>
      <MyButton />
      <a href="#!">Link</a>
    </Popout>
  ))
  .add('with Items', () => (
    <Popout>
      <MyButton />
      <List>
        <Item onClick={() => logger.log('pressed')}>
          <Icon type={<FakeIcon />} />
          <Title>Perform an action</Title>
          <Badge>Update</Badge>
        </Item>
        <Item onClick={() => logger.log('pressed')}>
          <Icon type={<FakeIcon />} />
          <Title>Perform an action</Title>
          <Detail>⌘⇧→</Detail>
        </Item>
        <Item onClick={() => logger.log('pressed')}>
          <Icon type={<FakeIcon />} />
          <Title>Perform an action</Title>
          <Detail>⌘⇧→</Detail>
        </Item>
      </List>
    </Popout>
  ))
  .add('with Items that close', () => (
    <Popout>
      <MyButton />
      {({ hide }) => (
        <List>
          <Item onClick={hide}>
            <Icon type={<FakeIcon />} />
            <Title>Perform an action</Title>
            <Badge>Update</Badge>
          </Item>
        </List>
      )}
    </Popout>
  ))
  .add('multiple open', () => (
    <Fragment>
      <Popout id="1">
        <MyButton />
        Hey! well hello there
      </Popout>
      <Popout id="2">
        <MyButton />
        Hey! well hello there
      </Popout>
    </Fragment>
  ));
