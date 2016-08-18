const { describe, it } = global;
import React from 'react';
import { shallow } from 'enzyme';
import DownPanel from '../index';
import { expect } from 'chai';
import sinon from 'sinon';

describe('manager.ui.components.down_panel.index', () => {
  it('should render only the selected panel', () => {
    const panels = {
      test1: {
        render() {
          return <div>TEST 1</div>;
        },
      },
      test2: {
        render() {
          return <div>TEST 2</div>;
        },
      },
    };

    const onPanelSelect = () => 'onPanelSelect';

    const wrapper = shallow(
      <DownPanel
        panels={panels}
        onPanelSelect={onPanelSelect}
        selectedPanel={'test2'}
      />
    );

    expect(wrapper.contains('TEST 2')).to.equal(true);
    expect(wrapper.contains('TEST 1')).to.equal(false);
  });

  it('should set onPanelSelected as onClick handlers of tabs', () => {
    const panels = {
      test1: {
        render() {
          return <div>TEST 1</div>;
        },
      },
    };

    const onPanelSelect = sinon.spy();
    const preventDefault = sinon.spy();

    const wrapper = shallow(
      <DownPanel
        panels={panels}
        onPanelSelect={onPanelSelect}
        selectedPanel={'test1'}
      />
    );

    wrapper.find('a').simulate('click', { preventDefault });
    expect(onPanelSelect.calledOnce).to.equal(true);
    expect(preventDefault.calledOnce).to.equal(true);
  });

  describe('when no panels are given', () => {
    it('should render "no panels available"', () => {
      const panels = {};

      const onPanelSelect = () => 'onPanelSelect';

      const wrapper = shallow(
        <DownPanel
          panels={panels}
          onPanelSelect={onPanelSelect}
        />
      );

      expect(wrapper.contains('no panels available')).to.equal(true);
    });
  });
});
