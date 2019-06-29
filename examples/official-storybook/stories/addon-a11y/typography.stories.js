/* eslint-disable */
import React, { Fragment } from 'react';

const text = 'Testing the a11y addon';
const href = 'javascript:void 0';

export default {
  title: 'Addons|A11y/Typography',
  parameters: {
    options: { selectedPanel: 'storybook/a11y/panel' },
  },
};

export const Correct = () => (
  <Fragment>
    <h1>{text}</h1>
    <p>{text}</p>
    <a href={href}>{`${text}...`}</a>
  </Fragment>
);

export const emptyHeading = () => <h1 />;

emptyHeading.story = {
  name: 'Empty Heading',
};

export const emptyParagraph = () => <p />;

emptyParagraph.story = {
  name: 'Empty Paragraph',
};

export const emptyLink = () => <a href={href} />;

emptyLink.story = {
  name: 'Empty Link',
};

export const linkWithoutHref = () => <a>{`${text}...`}</a>;

linkWithoutHref.story = {
  name: 'Link without href',
};
