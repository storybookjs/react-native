import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import styled from '@emotion/styled';

import { Spaced } from './grid';

const PlaceholderBlock = styled.div(({ color }) => ({
  background: color || 'hotpink',
  padding: 20,
}));
const PlaceholderInline = styled.span(({ color }) => ({
  background: color || 'hotpink',
  display: 'inline-block',
  padding: 20,
}));

storiesOf('Components|Grid', module)
  .add('row', () => (
    <Fragment>
      <PlaceholderBlock color="silver" />
      <Spaced row={1}>
        <PlaceholderBlock />
        <PlaceholderBlock />
        <PlaceholderBlock />
      </Spaced>
      <PlaceholderBlock color="silver" />
    </Fragment>
  ))
  .add('row outer', () => (
    <Fragment>
      <PlaceholderBlock color="silver" />
      <Spaced row={1} outer>
        <PlaceholderBlock />
        <PlaceholderBlock />
        <PlaceholderBlock />
      </Spaced>
      <PlaceholderBlock color="silver" />
    </Fragment>
  ))
  .add('row multiply', () => (
    <Fragment>
      <PlaceholderBlock color="silver" />
      <Spaced row={3} outer={0.5}>
        <PlaceholderBlock />
        <PlaceholderBlock />
        <PlaceholderBlock />
      </Spaced>
      <PlaceholderBlock color="silver" />
    </Fragment>
  ))
  .add('col', () => (
    <Fragment>
      <PlaceholderInline color="silver" />
      <Spaced col={1}>
        <PlaceholderInline />
        <PlaceholderInline />
        <PlaceholderInline />
      </Spaced>
      <PlaceholderInline color="silver" />
    </Fragment>
  ))
  .add('col outer', () => (
    <Fragment>
      <PlaceholderInline color="silver" />
      <Spaced col={1} outer>
        <PlaceholderInline />
        <PlaceholderInline />
        <PlaceholderInline />
      </Spaced>
      <PlaceholderInline color="silver" />
    </Fragment>
  ));
