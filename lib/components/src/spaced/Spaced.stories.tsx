import React from 'react';
import { storiesOf } from '@storybook/react';
import { styled } from '@storybook/theming';

import { Spaced } from './Spaced';

const PlaceholderBlock = styled.div(({ color }) => ({
  background: color || 'hotpink',
  padding: 20,
}));
const PlaceholderInline = styled.span(({ color }) => ({
  background: color || 'hotpink',
  display: 'inline-block',
  padding: 20,
}));

storiesOf('Basics|Spaced', module)
  .add('row', () => (
    <div>
      <PlaceholderBlock color="silver" />
      <Spaced row={1}>
        <PlaceholderBlock />
        <PlaceholderBlock />
        <PlaceholderBlock />
      </Spaced>
      <PlaceholderBlock color="silver" />
    </div>
  ))
  .add('row outer', () => (
    <div>
      <PlaceholderBlock color="silver" />
      <Spaced row={1} outer>
        <PlaceholderBlock />
        <PlaceholderBlock />
        <PlaceholderBlock />
      </Spaced>
      <PlaceholderBlock color="silver" />
    </div>
  ))
  .add('row multiply', () => (
    <div>
      <PlaceholderBlock color="silver" />
      <Spaced row={3} outer={0.5}>
        <PlaceholderBlock />
        <PlaceholderBlock />
        <PlaceholderBlock />
      </Spaced>
      <PlaceholderBlock color="silver" />
    </div>
  ))
  .add('col', () => (
    <div>
      <PlaceholderInline color="silver" />
      <Spaced col={1}>
        <PlaceholderInline />
        <PlaceholderInline />
        <PlaceholderInline />
      </Spaced>
      <PlaceholderInline color="silver" />
    </div>
  ))
  .add('col outer', () => (
    <div>
      <PlaceholderInline color="silver" />
      <Spaced col={1} outer>
        <PlaceholderInline />
        <PlaceholderInline />
        <PlaceholderInline />
      </Spaced>
      <PlaceholderInline color="silver" />
    </div>
  ));
