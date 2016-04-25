const { describe, it } = global;
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import StorybookControls from '../controls';

describe('<StorybookControls />', function () {
  describe('render', function () {
    it('should render stories - empty', function () {
      const data = [];
      const wrap = shallow(<StorybookControls storyStore={data} />);
      const list = wrap.find('div').first().children('div').last();
      expect(list.text()).to.equal('');
    });

    it('should render stories', function () {
      const data = [
        { kind: 'a', stories: ['a1', 'a2'] },
        { kind: 'b', stories: ['b1', 'b2'] },
      ];
      const wrap = shallow(<StorybookControls storyStore={data} />);
      const list = wrap.find('div').first().children('div').last();
      expect(list.text()).to.equal('ab');
    });

    it('should render stories with selected kind', function () {
      const data = [
        { kind: 'a', stories: ['a1', 'a2'] },
        { kind: 'b', stories: ['b1', 'b2'] },
      ];
      const wrap = shallow(<StorybookControls storyStore={data} selectedKind="a" />);
      const list = wrap.find('div').first().children('div').last();
      expect(list.text()).to.equal('aa1a2b');
    });
  });

  describe('functions', function () {
    it('should call the onKind prop when a kind is clicked', function () {
      const data = [
        { kind: 'a', stories: ['a1', 'a2'] },
        { kind: 'b', stories: ['b1', 'b2'] },
      ];
      const onKind = sinon.spy();
      const wrap = shallow(<StorybookControls storyStore={data} onKind={onKind} />);
      const kind = wrap.find('div')
        .filterWhere(el => el.text() === 'a')
        .last();
      kind.simulate('click');
      expect(onKind.calledOnce).to.equal(true);
      expect(onKind.firstCall.args).to.deep.equal(['a', null]);
    });

    it('should call the onStory prop when a story is clicked', function () {
      const data = [
        { kind: 'a', stories: ['a1', 'a2'] },
        { kind: 'b', stories: ['b1', 'b2'] },
      ];
      const onStory = sinon.spy();
      const wrap = shallow(
        <StorybookControls storyStore={data} selectedKind="a" onStory={onStory} />
      );
      const story = wrap.find('div')
        .filterWhere(el => el.text() === 'a1')
        .last();
      story.simulate('click');
      expect(onStory.calledOnce).to.equal(true);
      expect(onStory.firstCall.args).to.deep.equal(['a1']);
    });
  });
});
