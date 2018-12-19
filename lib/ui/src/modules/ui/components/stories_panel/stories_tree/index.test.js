import { shallow, mount } from 'enzyme';
import React from 'react';
import Stories from './index';
import { setContext } from '../../../../../compose';
import {
  createHierarchies,
  createHierarchyRoot,
  prepareStoriesForHierarchy,
} from '../../../libs/hierarchy';
import { storyFilter } from '../../../libs/filters';

const leftClick = { button: 0 };

describe('manager.ui.components.stories_panel.stories_tree', () => {
  beforeEach(() =>
    setContext({
      clientStore: {
        getAll() {
          return { shortcutOptions: {} };
        },
        subscribe() {},
      },
    })
  );

  afterEach(() => setContext(null));

  const data = createHierarchies([
    { kind: 'a', name: 'a', namespaces: ['a'], stories: ['a1', 'a2'] },
    { kind: 'b', name: 'b', namespaces: ['b'], stories: ['b1', 'b2'] },
  ])[0];

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

  const dataWithoutSeparator = createHierarchies(prepareStoriesForHierarchy(initialData))[0];
  const dataWithSeparator = createHierarchies(prepareStoriesForHierarchy(initialData, '\\.'))[0];

  describe('render', () => {
    test('should render stories - empty', () => {
      const wrap = shallow(
        <Stories
          storiesHierarchy={createHierarchyRoot()}
          selectedKind=""
          selectedStory=""
          selectedHierarchy={[]}
          sidebarAnimations={false}
        />
      );

      const list = wrap
        .find('div')
        .first()
        .children('div')
        .last();

      expect(list.text()).toBe('');
    });

    test('should render stories', () => {
      const wrap = shallow(
        <Stories
          storiesHierarchy={data}
          selectedKind="b"
          selectedStory="b2"
          selectedHierarchy={['b']}
          sidebarAnimations={false}
        />
      );

      const output = wrap.html();

      expect(output).toMatch(/b/);
      expect(output).toMatch(/b2/);
    });

    test('should render stories with hierarchy - hierarchySeparator is defined', () => {
      const wrap = shallow(
        <Stories
          storiesHierarchy={dataWithSeparator}
          selectedKind="another.space.20"
          selectedStory="b2"
          selectedHierarchy={['another', 'space', '20']}
          sidebarAnimations={false}
        />
      );

      const output = wrap.html();

      expect(output).toMatch(/some/);
      expect(output).not.toMatch(/>name</);
      expect(output).not.toMatch(/item1/);
      expect(output).not.toMatch(/a1/);
      expect(output).not.toMatch(/a2/);
      expect(output).toMatch(/another/);
      expect(output).toMatch(/space/);
      expect(output).toMatch(/20/);
      expect(output).toMatch(/b1/);
      expect(output).toMatch(/b2/);
    });

    test('should render stories without hierarchy - hierarchySeparator is not defined', () => {
      const wrap = shallow(
        <Stories
          storiesHierarchy={dataWithoutSeparator}
          selectedKind="another.space.20"
          selectedStory="b2"
          selectedHierarchy={['another.space.20']}
          sidebarAnimations={false}
        />
      );

      const output = wrap.html();

      expect(output).toMatch(/some.name.item1/);
      expect(output).not.toMatch(/a1/);
      expect(output).not.toMatch(/a2/);
      expect(output).toMatch(/another.space.20/);
      expect(output).toMatch(/b1/);
      expect(output).toMatch(/b2/);
    });

    test('should render stories with initially selected nodes according to the selectedHierarchy', () => {
      const wrap = shallow(
        <Stories
          storiesHierarchy={dataWithSeparator}
          selectedKind="another.space.20"
          selectedStory="b2"
          selectedHierarchy={['another', 'space', '20']}
          sidebarAnimations={false}
        />
      );

      const { nodes } = wrap.state();

      expect(nodes).toEqual({
        'another@namespace': true,
        'another@space@namespace': true,
        'another@space@20@namespace': true,
      });
    });

    test('should contain state with all selected nodes after clicking on the nodes', () => {
      const wrap = mount(
        <Stories
          storiesHierarchy={dataWithSeparator}
          selectedKind="another.space.20"
          selectedStory="b2"
          selectedHierarchy={['another', 'space', '20']}
          sidebarAnimations={false}
        />
      );

      const kind = wrap.find('[data-name="some"]').first();
      kind.simulate('click', leftClick);

      const { nodes } = wrap.state();

      expect(nodes).toEqual({
        'another@namespace': true,
        'another@space@namespace': true,
        'another@space@20@namespace': true,
        'some@namespace': true,
      });
    });

    test('should recalculate selected nodes after selectedHierarchy changes', () => {
      const wrap = mount(
        <Stories
          storiesHierarchy={dataWithSeparator}
          selectedKind="another.space.20"
          selectedStory="b2"
          selectedHierarchy={[]}
          sidebarAnimations={false}
        />
      );

      wrap.setProps({ selectedHierarchy: ['another', 'space', '20'] });

      const { nodes } = wrap.state();

      expect(nodes).toEqual({
        'another@namespace': true,
        'another@space@namespace': true,
        'another@space@20@namespace': true,
      });
    });

    test('should add selected nodes to the state after selectedHierarchy changes with a new value', () => {
      const wrap = mount(
        <Stories
          storiesHierarchy={dataWithSeparator}
          selectedKind="another.space.20"
          selectedStory="b2"
          selectedHierarchy={['another', 'space', '20']}
          sidebarAnimations={false}
        />
      );

      wrap.setProps({ selectedHierarchy: ['some', 'name', 'item1'] });

      const { nodes } = wrap.state();

      expect(nodes).toEqual({
        'another@namespace': true,
        'another@space@namespace': true,
        'another@space@20@namespace': true,
        'some@namespace': true,
        'some@name@namespace': true,
        'some@name@item1@namespace': true,
      });
    });

    test('should not call setState when selectedHierarchy prop changes with the same value', () => {
      const selectedHierarchy = ['another', 'space', '20'];
      const wrap = mount(
        <Stories
          storiesHierarchy={dataWithSeparator}
          selectedKind="another.space.20"
          selectedStory="b2"
          selectedHierarchy={selectedHierarchy}
          sidebarAnimations={false}
        />
      );

      const setState = jest.fn();
      wrap.instance().setState = setState;

      wrap.setProps({ selectedHierarchy });

      expect(setState).not.toHaveBeenCalled();
    });

    test('should render stories with with highlighting when storiesFilter is provided', () => {
      const filter = 'th';
      const selectedKind = 'another.space.20';

      const filteredData = storyFilter(
        prepareStoriesForHierarchy(initialData, '\\.'),
        filter,
        selectedKind
      );

      const filteredDataHierarchy = createHierarchies(filteredData);

      const wrap = mount(
        <Stories
          storiesHierarchy={filteredDataHierarchy[0]}
          selectedKind={selectedKind}
          selectedStory="b2"
          selectedHierarchy={['another', 'space', '20']}
          storyFilter={filter}
          sidebarAnimations={false}
        />
      );

      const highlightedElements = wrap.find('strong');

      expect(highlightedElements.text()).toBe('th');
    });
  });

  describe('events', () => {
    test('should not call the onSelectStory prop when a collapsed kind is clicked', () => {
      const onSelectStory = jest.fn();
      const wrap = mount(
        <Stories
          storiesHierarchy={data}
          selectedKind="b"
          selectedStory="b2"
          selectedHierarchy={['b']}
          onSelectStory={onSelectStory}
          sidebarAnimations={false}
        />
      );

      const kind = wrap.find('[data-name="a"]').first();
      kind.simulate('click', leftClick);

      expect(onSelectStory).not.toHaveBeenCalled();
    });

    test("shouldn't call the onSelectStory prop when an expanded kind is clicked", () => {
      const onSelectStory = jest.fn();
      const wrap = mount(
        <Stories
          storiesHierarchy={data}
          selectedKind="b"
          selectedStory="b2"
          selectedHierarchy={['b']}
          onSelectStory={onSelectStory}
          sidebarAnimations={false}
        />
      );

      const kind = wrap
        .find('[data-name="a"]')
        .filterWhere(el => el.text() === 'a')
        .last();
      kind.simulate('click');

      onSelectStory.mockClear();
      kind.simulate('click');

      expect(onSelectStory).not.toHaveBeenCalled();
    });

    test('should call the onSelectStory prop when a story is clicked', () => {
      const onSelectStory = jest.fn();
      const wrap = mount(
        <Stories
          storiesHierarchy={data}
          selectedKind="b"
          selectedStory="b2"
          selectedHierarchy={['b']}
          onSelectStory={onSelectStory}
          sidebarAnimations={false}
        />
      );

      const kind = wrap.find('[data-name="b1"]').first();
      kind.simulate('click', leftClick);

      expect(onSelectStory).toHaveBeenCalledWith('b', 'b1');
    });

    test('should call the onSelectStory prop when a story is clicked - hierarchySeparator is defined', () => {
      const onSelectStory = jest.fn();
      const wrap = mount(
        <Stories
          storiesHierarchy={dataWithSeparator}
          selectedKind="some.name.item1"
          selectedStory="a2"
          selectedHierarchy={['some', 'name', 'item1']}
          onSelectStory={onSelectStory}
          sidebarAnimations={false}
        />
      );

      wrap
        .find('[data-name="another"]')
        .first()
        .simulate('click', leftClick);

      wrap
        .find('[data-name="space"]')
        .first()
        .simulate('click', leftClick);

      wrap
        .find('[data-name="20"]')
        .first()
        .simulate('click', leftClick);

      expect(onSelectStory).not.toHaveBeenCalled();

      wrap
        .find('[data-name="b2"]')
        .first()
        .simulate('click', leftClick);

      expect(onSelectStory).toHaveBeenCalledWith('another.space.20', 'b2');
    });

    test('should call the onSelectStory prop when a story is selected with enter key', () => {
      const onSelectStory = jest.fn();
      const wrap = mount(
        <Stories
          storiesHierarchy={dataWithSeparator}
          selectedKind="some.name.item1"
          selectedStory="a2"
          selectedHierarchy={['some', 'name', 'item1']}
          onSelectStory={onSelectStory}
          sidebarAnimations={false}
        />
      );

      wrap
        .find('[data-name="another"]')
        .first()
        .simulate('keyDown', { keyCode: 13 });

      expect(onSelectStory).not.toHaveBeenCalled();

      wrap
        .find('[data-name="space"]')
        .first()
        .simulate('keyDown', { keyCode: 13 });

      // enter press on native link triggers click event
      wrap
        .find('[data-name="20"]')
        .first()
        .simulate('click', leftClick);

      wrap
        .find('[data-name="b2"]')
        .first()
        .simulate('click', leftClick);

      expect(onSelectStory).toHaveBeenCalledWith('another.space.20', 'b2');
    });
  });
});
