import React from 'react';
import { storiesOf } from '@storybook/react';
import { ServerLocation } from '@reach/router';

import { themes, ThemeProvider } from '@storybook/theming';
import { Spaced } from '@storybook/components';

import Nav from './nav';
import { StoriesExplorer } from './explorer';
import { Leaf, Head, Title, Filter } from './explorer-components';

import { mockDataset } from './treeview.mockdata';

const { light: theme } = themes;

const props = {
  title: 'Title',
  url: 'https://example.com',
  notifications: [],
  stories: {},
};

storiesOf('UI|Nav', module)
  .addDecorator(fn => (
    <ServerLocation url="http://localhost:9011/?path=/settings">{fn()}</ServerLocation>
  ))
  .add('default', () => (
    <ThemeProvider theme={{ ...theme, brand: null }}>
      <Nav {...props} />
    </ThemeProvider>
  ))
  .add('with custom brand', () => (
    <ThemeProvider theme={{ ...theme, brand: 'custom brand' }}>
      <Nav {...props} />
    </ThemeProvider>
  ));

storiesOf('UI|StoriesExplorer', module)
  .add('with treeview root', () => (
    <Spaced>
      <StoriesExplorer stories={mockDataset.withRoot} storyId="1-12-121" />
    </Spaced>
  ))
  .add('without treeview root', () => (
    <Spaced>
      <StoriesExplorer stories={mockDataset.noRoot} storyId="1-12-121" />
    </Spaced>
  ))
  .add('empty', () => (
    <Spaced>
      <StoriesExplorer stories={{}} storyId="" />
    </Spaced>
  ));

storiesOf('UI|StoriesExplorer/subcomponents', module)
  .add('Leaf', () => (
    <Spaced outer={1}>
      <Leaf {...mockDataset.withRoot['1']} name="not selected" isSelected={false} />
      <Leaf {...mockDataset.withRoot['1']} name="selected" isSelected />
      <hr />
      <Leaf depth={0} name="depth = 0" isSelected={false} />
      <Leaf depth={1} name="depth = 1" isSelected={false} />
      <Leaf depth={2} name="depth = 2" isSelected={false} />
      <Leaf depth={3} name="depth = 3" isSelected={false} />
    </Spaced>
  ))
  .add('Head', () => (
    <Spaced outer={1}>
      <Head {...mockDataset.withRoot['1']} name="normal" isExpanded={false} isSelected={false} />
      <Head {...mockDataset.withRoot['1']} name="isSelected" isExpanded={false} isSelected />
      <Head {...mockDataset.withRoot['1']} name="isExpanded" isExpanded isSelected={false} />
      <Head
        {...mockDataset.withRoot['1']}
        name="isComponent"
        isExpanded
        isSelected={false}
        isComponent
      />
      <hr />
      <Head depth={0} name="depth = 0" isExpanded={false} isSelected={false} />
      <Head depth={1} name="depth = 1" isExpanded={false} isSelected={false} />
      <Head depth={2} name="depth = 2" isExpanded={false} isSelected={false} />
      <Head depth={3} name="depth = 3" isExpanded={false} isSelected={false} />
    </Spaced>
  ))
  .add('Title', () => (
    <Spaced outer={1}>
      <Title type="section" mods={['uppercase']}>
        This is a Root title
      </Title>
    </Spaced>
  ))
  .add('Filter', () => (
    <Spaced outer={1}>
      <Filter />
      <hr />
      <Filter value="with a value" />
    </Spaced>
  ));
