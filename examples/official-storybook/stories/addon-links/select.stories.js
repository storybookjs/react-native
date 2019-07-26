import React from 'react';
import { linkTo } from '@storybook/addon-links';
import LinkTo from '@storybook/addon-links/react';

export default {
  title: 'Addons|Links.Select',
};

export const Index = () => (
  <select value="Index" onChange={linkTo('Addons|Links.Select', e => e.currentTarget.value)}>
    <option>Index</option>
    <option>First</option>
    <option>Second</option>
    <option>Third</option>
  </select>
);

export const First = () => <LinkTo story="Index">Go back</LinkTo>;
export const Second = () => <LinkTo story="Index">Go back</LinkTo>;
export const Third = () => <LinkTo story="Index">Go back</LinkTo>;
