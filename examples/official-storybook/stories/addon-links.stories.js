import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo, hrefTo } from '@storybook/addon-links';
import LinkTo from '@storybook/addon-links/react';
import { action } from '@storybook/addon-actions';

storiesOf('Addon Links.Link', module)
  .add('First', () => <LinkTo story="Second">Go to Second</LinkTo>)
  .add('Second', () => <LinkTo story="First">Go to First</LinkTo>);

storiesOf('Addon Links.Button', module)
  .add('First', () => (
    <button onClick={linkTo('Addon Links.Button', 'Second')}>Go to "Second"</button>
  ))
  .add('Second', () => (
    <button onClick={linkTo('Addon Links.Button', 'First')}>Go to "First"</button>
  ));

storiesOf('Addon Links.Select', module)
  .add('Index', () => (
    <select value="Index" onChange={linkTo('Addon Links.Select', e => e.currentTarget.value)}>
      <option>Index</option>
      <option>First</option>
      <option>Second</option>
      <option>Third</option>
    </select>
  ))
  .add('First', () => <LinkTo story="Index">Go back</LinkTo>)
  .add('Second', () => <LinkTo story="Index">Go back</LinkTo>)
  .add('Third', () => <LinkTo story="Index">Go back</LinkTo>);

storiesOf('Addon Links.Href', module).add('log', () => {
  hrefTo('Addon Links.Href', 'log').then(href => action('URL of this story')({ href }));

  return <span>See action logger</span>;
});
