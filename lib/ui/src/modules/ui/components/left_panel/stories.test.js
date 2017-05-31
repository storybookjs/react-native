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
  });
});
