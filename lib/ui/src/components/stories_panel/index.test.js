import React from 'react';
import { shallow } from 'enzyme';

import { Header } from '@storybook/components';
import StoriesPanel from './index';
import TextFilter from './text_filter';
import Stories from './stories_tree';

import { createHierarchies } from '../../libs/hierarchy';

describe('manager.ui.components.stories_panel.index', () => {
  test('should render Header and TextFilter by default', () => {
    const openShortcutsHelp = jest.fn();
    const storyFilter = 'xxxxx';
    const wrap = shallow(
      <StoriesPanel openShortcutsHelp={openShortcutsHelp} storyFilter={storyFilter} />
    );

    const header = wrap.find(Header).first();
    expect(header).toHaveProp('openShortcutsHelp', openShortcutsHelp);

    const textFilter = wrap.find(TextFilter).first();
    expect(textFilter).toHaveProp('text', storyFilter);

    expect(wrap.find(Stories)).not.toExist();
  });

  test('should render stories only if storiesHierarchies prop exists', () => {
    const selectedKind = 'kk';
    const selectedStory = 'bb';
    const storiesHierarchies = createHierarchies([
      { kind: 'kk', namespaces: ['kk'], stories: ['bb'] },
    ]);
    const wrap = shallow(
      <StoriesPanel
        storiesHierarchies={storiesHierarchies}
        selectedKind={selectedKind}
        selectedStory={selectedStory}
        selectedHierarchy={['kk']}
      />
    );

    expect(wrap.find(Stories)).toHaveLength(1);

    const element = wrap.find(Stories).first();
    expect(element.props()).toMatchObject({
      storiesHierarchy: storiesHierarchies[0],
      selectedKind,
      selectedStory,
    });
  });

  test('should render multiple stories if multiple storiesHierarchies exist', () => {
    const selectedKind = 'kk';
    const selectedStory = 'bb';
    const stories = [
      { kind: 'kk', namespaces: ['kk'], stories: ['bb'], rootName: 'a' },
      { kind: 'kk', namespaces: ['kk'], stories: ['bb'], rootName: 'b' },
    ];
    const storiesHierarchies = createHierarchies(stories);
    const wrap = shallow(
      <StoriesPanel
        storiesHierarchies={storiesHierarchies}
        selectedKind={selectedKind}
        selectedStory={selectedStory}
        selectedHierarchy={['kk']}
      />
    );

    expect(wrap.find(Stories)).toHaveLength(2);

    const first = wrap.find(Stories).first();
    expect(first.props()).toMatchObject({
      storiesHierarchy: storiesHierarchies[0],
      selectedKind,
      selectedStory,
    });

    const second = wrap.find(Stories).at(1);
    expect(second.props()).toMatchObject({
      storiesHierarchy: storiesHierarchies[1],
      selectedKind,
      selectedStory,
    });
  });

  test('should not render stories if storiesHierarchy exists but is empty', () => {
    const storiesHierarchies = createHierarchies([]);
    const wrap = shallow(<StoriesPanel storiesHierarchies={storiesHierarchies} />);

    expect(wrap.find(Stories).exists()).toBe(false);
  });

  describe('onStoryFilter prop', () => {
    test('should set filter as an empty text on TextFilter.onClear', () => {
      const onStoryFilter = jest.fn();
      const wrap = shallow(<StoriesPanel onStoryFilter={onStoryFilter} />);

      const textFilter = wrap.find(TextFilter).first();
      textFilter.props().onClear();

      expect(onStoryFilter).toHaveBeenCalledWith('');
    });

    test('should set filter as the given text of TextFilter.onChange', () => {
      const onStoryFilter = jest.fn();
      const filterText = 'XXX';
      const wrap = shallow(<StoriesPanel onStoryFilter={onStoryFilter} />);

      const textFilter = wrap.find(TextFilter).first();
      textFilter.props().onChange(filterText);

      expect(onStoryFilter).toHaveBeenCalledWith(filterText);
    });
  });
});
