import React from 'react';
import Grid from '../Grid';
import './style.css';

export default ({ items }) => (
  <div className="examples">
    <div className="heading">
      <h1>Storybook Examples</h1>
      <a
        className="edit-link"
        href="https://github.com/storybooks/storybooks.github.io/tree/source/pages/examples/_examples.yml"
        target="_blank"
      >
        Edit this list
      </a>
    </div>
    <Grid columnWidth={350} items={items} />
  </div>
);
