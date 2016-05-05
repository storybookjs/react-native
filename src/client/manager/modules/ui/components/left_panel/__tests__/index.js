const { describe, it } = global;
import React from 'react';
import { shallow } from 'enzyme';
import LeftPanel from '../index';
import Header from '../header';
import TextFilter from '../text_filter';
import Stories from '../stories';
import { expect } from 'chai';
import sinon from 'sinon';

describe('manager.ui.components.left_panel.index', () => {
  it('should render Header and TextFilter by default', () => {
    const openShortcutsHelp = sinon.stub();
    const storyFilter = 'xxxxx';

    const wrap = shallow(
      <LeftPanel
        openShortcutsHelp={openShortcutsHelp}
        storyFilter={storyFilter}
      />
    );
    const header = wrap.find(Header).first();
    expect(header.props().openShortcutsHelp).to.be.equal(openShortcutsHelp);

    const textFilter = wrap.find(TextFilter).first();
    expect(textFilter.props().text).to.be.equal(storyFilter);

    expect(wrap.find(Stories).length).to.be.equal(0);
  });

  it('should render stories only if stories prop exists', () => {
    const selectedKind = 'kk';
    const selectedStory = 'bb';
    const stories = [
      { kind: 'kk', stories: ['bb'] },
    ];

    const wrap = shallow(
      <LeftPanel
        stories={stories}
        selectedKind={selectedKind}
        selectedStory={selectedStory}
      />
    );
    const header = wrap.find(Stories).first();
    expect(header.props()).to.deep.equal({
      stories,
      selectedKind,
      selectedStory,
    });
  });

  describe('onStoryFilter prop', () => {
    it('should set filter as an empty text on TextFilter.onClear', () => {
      const onStoryFilter = sinon.stub();

      const wrap = shallow(
        <LeftPanel
          onStoryFilter={onStoryFilter}
        />
      );

      const textFilter = wrap.find(TextFilter).first();
      textFilter.props().onClear();

      expect(onStoryFilter.firstCall.args).to.deep.equal(['']);
    });

    it('should set filter as the given text of TextFilter.onChange', () => {
      const onStoryFilter = sinon.stub();
      const filterText = 'XXX';

      const wrap = shallow(
        <LeftPanel
          onStoryFilter={onStoryFilter}
        />
      );

      const textFilter = wrap.find(TextFilter).first();
      textFilter.props().onChange(filterText);

      expect(onStoryFilter.firstCall.args).to.deep.equal([filterText]);
    });
  });
});
