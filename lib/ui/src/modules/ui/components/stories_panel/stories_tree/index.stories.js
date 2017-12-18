import React from 'react';
import { storiesOf } from '@storybook/react';

import Stories from './index';
import { setContext } from '../../../../../compose';
import { createHierarchy, prepareStoriesForHierarchy } from '../../../libs/hierarchy';
import { storyFilter } from '../../../libs/filters';
import withLifecyle from '../../../../../libs/withLifecycleDecorator';

const data = createHierarchy([
  { kind: 'a', name: 'a', namespaces: ['a'], stories: ['a1', 'a2'] },
  { kind: 'b', name: 'b', namespaces: ['b'], stories: ['b1', 'b2'] },
]);

const initialData = [
  {
    kind: 'some.name.item1',
    stories: ['a1', 'a2'],
  },
  {
    kind: 'another.space.20',
    stories: ['b1', 'b2'],
  },
];
const dataWithoutSeparator = createHierarchy(prepareStoriesForHierarchy(initialData));
const dataWithSeparator = createHierarchy(prepareStoriesForHierarchy(initialData, '\\.'));

const filter = 'th';
const selectedKind = 'another.space.20';

const filteredData = storyFilter(
  prepareStoriesForHierarchy(initialData, '\\.'),
  filter,
  selectedKind
);

const filteredDataHierarchy = createHierarchy(filteredData);

const decorator = withLifecyle({
  beforeEach() {
    setContext({
      clientStore: {
        getAll() {
          return { shortcutOptions: {} };
        },
        subscribe() {},
      },
    });
  },
  afterEach() {
    setContext(null);
  },
});

storiesOf('ui/stories/Stories', module)
  .addDecorator(decorator)
  .add('empty', () => (
    <Stories
      storiesHierarchy={createHierarchy([])}
      selectedKind=""
      selectedStory=""
      selectedHierarchy={[]}
    />
  ))
  .add('simple', () => (
    <Stories
      storiesHierarchy={data}
      selectedKind="b"
      selectedStory="b2"
      selectedHierarchy={['b']}
    />
  ))
  .add('with hierarchy - hierarchySeparator is defined', () => (
    <Stories
      storiesHierarchy={dataWithSeparator}
      selectedKind="another.space.20"
      selectedStory="b2"
      selectedHierarchy={['another', 'space', '20']}
    />
  ))
  .add('without hierarchy - hierarchySeparator is defined', () => (
    <Stories
      storiesHierarchy={dataWithoutSeparator}
      selectedKind="another.space.20"
      selectedStory="b2"
      selectedHierarchy={['another.space.20']}
    />
  ))
  .add('with highlighting when storiesFilter is provided', () => (
    <Stories
      storiesHierarchy={filteredDataHierarchy}
      selectedKind={selectedKind}
      selectedStory="b2"
      selectedHierarchy={['another', 'space', '20']}
      storyFilter={filter}
    />
  ));
