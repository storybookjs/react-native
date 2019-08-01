import React from 'react';
import { action } from '@storybook/addon-actions';

import { Preview } from './Preview';
import { DocsPageWrapper } from './DocsPage';
import { Button } from '../Button/Button';
import * as sourceStories from './Source.stories';

export default {
  title: 'Docs|Preview',
  component: Preview,
  decorators: [getStory => <DocsPageWrapper>{getStory()}</DocsPageWrapper>],
};

export const codeCollapsed = () => (
  <Preview isExpanded={false} withSource={sourceStories.jsx().props}>
    <Button secondary>Button 1</Button>
  </Preview>
);

export const codeExpanded = () => (
  <Preview isExpanded withSource={sourceStories.jsx().props}>
    <Button secondary>Button 1</Button>
  </Preview>
);

export const codeError = () => (
  <Preview isExpanded withSource={sourceStories.sourceUnavailable().props}>
    <Button secondary>Button 1</Button>
  </Preview>
);

export const single = () => (
  <Preview>
    <Button secondary>Button 1</Button>
  </Preview>
);

export const row = () => (
  <Preview>
    <Button secondary>Button 1</Button>
    <Button secondary>Button 2</Button>
    <Button secondary>Button 3</Button>
    <Button secondary>Button 4</Button>
    <Button secondary>Button 5</Button>
    <Button secondary>Button 6</Button>
    <Button secondary>Button 7</Button>
  </Preview>
);

export const column = () => (
  <Preview isColumn>
    <Button secondary>Button 1</Button>
    <Button secondary>Button 2</Button>
    <Button secondary>Button 3</Button>
  </Preview>
);

export const gridWith3Columns = () => (
  <Preview columns={3}>
    <Button secondary>Button 1</Button>
    <Button secondary>Button 2</Button>
    <Button secondary>Button 3</Button>
    <Button secondary>Button 4</Button>
    <Button secondary>Button 5</Button>
    <Button secondary>Button 6</Button>
    <Button secondary>Button 7 long long long long long title</Button>
    <Button secondary>Button 8</Button>
    <Button secondary>Button 9</Button>
    <Button secondary>Button 10</Button>
    <Button secondary>Button 11</Button>
    <Button secondary>Button 12</Button>
    <Button secondary>Button 13</Button>
    <Button secondary>Button 14</Button>
    <Button secondary>Button 15</Button>
    <Button secondary>Button 16</Button>
    <Button secondary>Button 17</Button>
    <Button secondary>Button 18</Button>
    <Button secondary>Button 19</Button>
    <Button secondary>Button 20</Button>
  </Preview>
);
