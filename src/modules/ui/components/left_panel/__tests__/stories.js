const { describe, it } = global;
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import Stories from '../stories';

describe('manager.ui.components.left_panel.stories', function () {
  describe('render', function () {
    it('should render stories - empty', function () {
      const data = [];
      const wrap = shallow(<Stories stories={data} />);
      const list = wrap.find('div').first().children('div').last();
      expect(list.text()).to.equal('');
    });

    it('should render stories', function () {
      const data = [
        { kind: 'a', stories: ['a1', 'a2'] },
        { kind: 'b', stories: ['b1', 'b2'] },
      ];
      const wrap = shallow(
        <Stories
          stories={data}
          selectedKind="b"
          selectedStory="b2"
        />
      );
      const selectedKind = wrap.find('[selectedKind]');
      const selectedStory = wrap.find('[selectedStory]');
      expect(selectedKind.text()).to.be.equal('b');
      expect(selectedStory.text()).to.be.equal('b2');
    });
  });

  describe('events', () => {
    it('should call the onSelectStory prop when a kind is clicked', function () {
      const data = [
        { kind: 'a', stories: ['a1', 'a2'] },
        { kind: 'b', stories: ['b1', 'b2'] },
      ];
      const onSelectStory = sinon.spy();

      const wrap = shallow(
        <Stories
          stories={data}
          selectedKind="b"
          selectedStory="b2"
          onSelectStory={onSelectStory}
        />
      );

      const kind = wrap.find('div')
        .filterWhere(el => el.text() === 'a')
        .last();
      kind.simulate('click');
      expect(onSelectStory.calledOnce).to.equal(true);
      expect(onSelectStory.firstCall.args).to.deep.equal(['a', null]);
    });

    it('should call the onSelectStory prop when a story is clicked', function () {
      const data = [
        { kind: 'a', stories: ['a1', 'a2'] },
        { kind: 'b', stories: ['b1', 'b2'] },
      ];
      const onSelectStory = sinon.spy();

      const wrap = shallow(
        <Stories
          stories={data}
          selectedKind="b"
          selectedStory="b2"
          onSelectStory={onSelectStory}
        />
      );

      const kind = wrap.find('div')
        .filterWhere(el => el.text() === 'b1')
        .last();
      kind.simulate('click');
      expect(onSelectStory.calledOnce).to.equal(true);
      expect(onSelectStory.firstCall.args).to.deep.equal(['b', 'b1']);
    });
  });
});
