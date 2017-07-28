import { shallow, mount } from 'enzyme';
import React from 'react';
import Stories from './index';
import { createHierarchy } from '../../../libs/hierarchy';

describe('manager.ui.components.left_panel.stories', () => {
  describe('render', () => {
    test('should render stories - empty', () => {
      const data = createHierarchy([]);
      const wrap = shallow(
        <Stories
          storiesHierarchy={data}
          selectedKind={''}
          selectedStory={''}
          selectedHierarchy={[]}
        />
      );

      const list = wrap.find('div').first().children('div').last();

      expect(list.text()).toBe('');
    });

    test('should render stories', () => {
      const data = createHierarchy([
        { kind: 'a', stories: ['a1', 'a2'] },
        { kind: '20', stories: ['b1', 'b2'] },
      ]);
      const wrap = shallow(
        <Stories
          storiesHierarchy={data}
          selectedKind="20"
          selectedStory="b2"
          selectedHierarchy={['20']}
        />
      );

      const output = wrap.html();

      expect(output).toMatch(/20/);
      expect(output).toMatch(/b2/);
    });

    test('should render stories with hierarchy - hierarchySeparator is defined', () => {
      const data = createHierarchy(
        [
          { kind: 'some.name.item1', stories: ['a1', 'a2'] },
          { kind: 'another.space.20', stories: ['b1', 'b2'] },
        ],
        '\\.'
      );
      const wrap = shallow(
        <Stories
          storiesHierarchy={data}
          selectedKind="another.space.20"
          selectedStory="b2"
          selectedHierarchy={['another', 'space', '20']}
        />
      );

      const output = wrap.html();

      expect(output).toMatch(/some/);
      expect(output).not.toMatch(/name/);
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
      const data = createHierarchy([
        { kind: 'some.name.item1', stories: ['a1', 'a2'] },
        { kind: 'another.space.20', stories: ['b1', 'b2'] },
      ]);
      const wrap = shallow(
        <Stories
          storiesHierarchy={data}
          selectedKind="another.space.20"
          selectedStory="b2"
          selectedHierarchy={['another.space.20']}
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
      const data = createHierarchy(
        [
          { kind: 'some.name.item1', stories: ['a1', 'a2'] },
          { kind: 'another.space.20', stories: ['b1', 'b2'] },
        ],
        '\\.'
      );
      const wrap = shallow(
        <Stories
          storiesHierarchy={data}
          selectedKind="another.space.20"
          selectedStory="b2"
          selectedHierarchy={['another', 'space', '20']}
        />
      );

      const { nodes } = wrap.state();

      expect(nodes).toEqual({
        'another@namespace': true,
        'another@space@namespace': true,
        'another@space@20@component': true,
      });
    });

    test('should contain state with all selected nodes after clicking on the nodes', () => {
      const data = createHierarchy(
        [
          { kind: 'some.name.item1', stories: ['a1', 'a2'] },
          { kind: 'another.space.20', stories: ['b1', 'b2'] },
        ],
        '\\.'
      );
      const wrap = mount(
        <Stories
          storiesHierarchy={data}
          selectedKind="another.space.20"
          selectedStory="b2"
          selectedHierarchy={['another', 'space', '20']}
        />
      );

      const kind = wrap.find('a').filterWhere(el => el.text() === 'some').last();
      kind.simulate('click');

      const { nodes } = wrap.state();

      expect(nodes).toEqual({
        'another@namespace': true,
        'another@space@namespace': true,
        'another@space@20@component': true,
        'some@namespace': true,
      });
    });

    test('should recalculate selected nodes after selectedHierarchy changes', () => {
      const data = createHierarchy(
        [
          { kind: 'some.name.item1', stories: ['a1', 'a2'] },
          { kind: 'another.space.20', stories: ['b1', 'b2'] },
        ],
        '\\.'
      );
      const wrap = mount(
        <Stories
          storiesHierarchy={data}
          selectedKind="another.space.20"
          selectedStory="b2"
          selectedHierarchy={[]}
        />
      );

      wrap.setProps({ selectedHierarchy: ['another', 'space', '20'] });

      const { nodes } = wrap.state();

      expect(nodes).toEqual({
        'another@namespace': true,
        'another@space@namespace': true,
        'another@space@20@component': true,
      });
    });

    test('should add selected nodes to the state after selectedHierarchy changes with a new value', () => {
      const data = createHierarchy(
        [
          { kind: 'some.name.item1', stories: ['a1', 'a2'] },
          { kind: 'another.space.20', stories: ['b1', 'b2'] },
        ],
        '\\.'
      );
      const wrap = mount(
        <Stories
          storiesHierarchy={data}
          selectedKind="another.space.20"
          selectedStory="b2"
          selectedHierarchy={['another', 'space', '20']}
        />
      );

      wrap.setProps({ selectedHierarchy: ['some', 'name', 'item1'] });

      const { nodes } = wrap.state();

      expect(nodes).toEqual({
        'another@namespace': true,
        'another@space@namespace': true,
        'another@space@20@component': true,
        'some@namespace': true,
        'some@name@namespace': true,
        'some@name@item1@component': true,
      });
    });

    test('should not call setState when selectedHierarchy prop changes with the same value', () => {
      const selectedHierarchy = ['another', 'space', '20'];
      const data = createHierarchy(
        [
          { kind: 'some.name.item1', stories: ['a1', 'a2'] },
          { kind: 'another.space.20', stories: ['b1', 'b2'] },
        ],
        '\\.'
      );
      const wrap = mount(
        <Stories
          storiesHierarchy={data}
          selectedKind="another.space.20"
          selectedStory="b2"
          selectedHierarchy={selectedHierarchy}
        />
      );

      const setState = jest.fn();
      wrap.instance().setState = setState;

      wrap.setProps({ selectedHierarchy });

      expect(setState).not.toHaveBeenCalled();
    });
  });

  describe('events', () => {
    test('should call the onSelectStory prop when a kind is clicked', () => {
      const data = createHierarchy([
        { kind: 'a', stories: ['a1', 'a2'] },
        { kind: 'b', stories: ['b1', 'b2'] },
      ]);
      const onSelectStory = jest.fn();
      const wrap = mount(
        <Stories
          storiesHierarchy={data}
          selectedKind="b"
          selectedStory="b2"
          selectedHierarchy={['b']}
          onSelectStory={onSelectStory}
        />
      );

      const kind = wrap.find('a').filterWhere(el => el.text() === 'a').last();
      kind.simulate('click');

      expect(onSelectStory).toHaveBeenCalledWith('a', null);
    });

    test('should call the onSelectStory prop when a story is clicked', () => {
      const data = createHierarchy([
        { kind: 'a', stories: ['a1', 'a2'] },
        { kind: 'b', stories: ['b1', 'b2'] },
      ]);
      const onSelectStory = jest.fn();
      const wrap = mount(
        <Stories
          storiesHierarchy={data}
          selectedKind="b"
          selectedStory="b2"
          selectedHierarchy={['b']}
          onSelectStory={onSelectStory}
        />
      );

      const kind = wrap.find('a').filterWhere(el => el.text() === 'b1').last();
      kind.simulate('click');

      expect(onSelectStory).toHaveBeenCalledWith('b', 'b1');
    });

    test('should call the onSelectStory prop when a story is clicked - hierarchySeparator is defined', () => {
      const data = createHierarchy(
        [
          { kind: 'some.name.item1', stories: ['a1', 'a2'] },
          { kind: 'another.space.20', stories: ['b1', 'b2'] },
        ],
        '\\.'
      );

      const onSelectStory = jest.fn();
      const wrap = mount(
        <Stories
          storiesHierarchy={data}
          selectedKind="some.name.item1"
          selectedStory="a2"
          selectedHierarchy={['some', 'name', 'item1']}
          onSelectStory={onSelectStory}
        />
      );

      wrap.find('a').filterWhere(el => el.text() === 'another').last().simulate('click');
      wrap.find('a').filterWhere(el => el.text() === 'space').last().simulate('click');
      wrap.find('a').filterWhere(el => el.text() === '20').last().simulate('click');

      expect(onSelectStory).toHaveBeenCalledWith('another.space.20', null);

      wrap.find('a').filterWhere(el => el.text() === 'b2').last().simulate('click');

      expect(onSelectStory).toHaveBeenCalledWith('another.space.20', 'b2');
    });

    test('should call the onSelectStory prop when a story is selected with enter key', () => {
      const data = createHierarchy(
        [
          { kind: 'some.name.item1', stories: ['a1', 'a2'] },
          { kind: 'another.space.20', stories: ['b1', 'b2'] },
        ],
        '\\.'
      );

      const onSelectStory = jest.fn();
      const wrap = mount(
        <Stories
          storiesHierarchy={data}
          selectedKind="some.name.item1"
          selectedStory="a2"
          selectedHierarchy={['some', 'name', 'item1']}
          onSelectStory={onSelectStory}
        />
      );

      wrap
        .find('a')
        .filterWhere(el => el.text() === 'another')
        .last()
        .simulate('keyDown', { keyCode: 13 });

      wrap
        .find('a')
        .filterWhere(el => el.text() === 'space')
        .last()
        .simulate('keyDown', { keyCode: 13 });

      wrap
        .find('a')
        .filterWhere(el => el.text() === '20')
        .last()
        .simulate('keyDown', { keyCode: 13 });

      expect(onSelectStory).toHaveBeenCalledWith('another.space.20', null);
    });
  });
});
