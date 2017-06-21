import { shallow } from 'enzyme';
import React from 'react';
import Stories from './stories';

describe('manager.ui.components.left_panel.stories', () => {
  describe('render', () => {
    test('should render stories - empty', () => {
      const data = [];
      const wrap = shallow(<Stories stories={data} />);

      const list = wrap.find('div').first().children('div').last();

      expect(list.text()).toBe('');
    });

    test('should render stories', () => {
      const data = [{ kind: 'a', stories: ['a1', 'a2'] }, { kind: '20', stories: ['b1', 'b2'] }];
      const wrap = shallow(<Stories stories={data} selectedKind="20" selectedStory="b2" />);

      const output = wrap.html();

      expect(output).toMatch(/20/);
      expect(output).toMatch(/b2/);
    });

    test('should render stories with hierarchy - leftPanelHierarchy is true', () => {
      const data = [
        { kind: 'some.name.item1', stories: ['a1', 'a2'] },
        { kind: 'another.space.20', stories: ['b1', 'b2'] },
      ];
      const wrap = shallow(
        <Stories
          stories={data}
          selectedKind="another.space.20"
          selectedStory="b2"
          leftPanelHierarchy
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

    test('should render stories without hierarchy - leftPanelHierarchy is false', () => {
      const data = [
        { kind: 'some.name.item1', stories: ['a1', 'a2'] },
        { kind: 'another.space.20', stories: ['b1', 'b2'] },
      ];
      const wrap = shallow(
        <Stories
          stories={data}
          selectedKind="another.space.20"
          selectedStory="b2"
          leftPanelHierarchy={false}
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
  });

  describe('events', () => {
    test('should call the onSelectStory prop when a kind is clicked', () => {
      const data = [{ kind: 'a', stories: ['a1', 'a2'] }, { kind: 'b', stories: ['b1', 'b2'] }];
      const onSelectStory = jest.fn();
      const wrap = shallow(
        <Stories stories={data} selectedKind="b" selectedStory="b2" onSelectStory={onSelectStory} />
      );

      const kind = wrap.find('a').filterWhere(el => el.text() === 'a').last();
      kind.simulate('click');

      expect(onSelectStory).toHaveBeenCalledWith('a', null);
    });

    test('should call the onSelectStory prop when a story is clicked', () => {
      const data = [{ kind: 'a', stories: ['a1', 'a2'] }, { kind: 'b', stories: ['b1', 'b2'] }];
      const onSelectStory = jest.fn();
      const wrap = shallow(
        <Stories stories={data} selectedKind="b" selectedStory="b2" onSelectStory={onSelectStory} />
      );

      const kind = wrap.find('a').filterWhere(el => el.text() === 'b1').last();
      kind.simulate('click');

      expect(onSelectStory).toHaveBeenCalledWith('b', 'b1');
    });

    test('should call the onSelectStory prop when a namespace is clicked - leftPanelHierarchy is true', () => {
      const data = [
        { kind: 'some.name.item1', stories: ['a1', 'a2'] },
        { kind: 'another.space.20', stories: ['b1', 'b2'] },
      ];
      const onSelectStory = jest.fn();
      const wrap = shallow(
        <Stories
          stories={data}
          selectedKind="some.name.item1"
          selectedStory="a2"
          onSelectStory={onSelectStory}
          leftPanelHierarchy
        />
      );

      const kind = wrap.find('a').filterWhere(el => el.text() === 'another').last();
      kind.simulate('click');

      expect(onSelectStory).toHaveBeenCalledWith('another.space.20', null);
    });
  });
});
