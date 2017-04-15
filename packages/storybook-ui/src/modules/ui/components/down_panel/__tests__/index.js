const { describe, it } = global;
import React from 'react';
import { shallow } from 'enzyme';
import DownPanel from '../index';
import { expect } from 'chai';
import sinon from 'sinon';

describe('manager.ui.components.down_panel.index', () => {
  it('should render only the selected panel with display set other than "none"', () => {
    const panels = {
      test1: {
        render() {
          return <div id="test1">TEST 1</div>;
        },
      },
      test2: {
        render() {
          return <div id="test2">TEST 2</div>;
        },
      },
    };

    const onPanelSelect = () => 'onPanelSelect';

    const wrapper = shallow(
      <DownPanel panels={panels} onPanelSelect={onPanelSelect} selectedPanel={'test2'} />,
    );

    expect(wrapper.find('#test1').parent().props().style.display).to.equal('none');
    expect(wrapper.find('#test2').parent().props().style.display).to.not.equal('none');
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
      <DownPanel panels={panels} onPanelSelect={onPanelSelect} selectedPanel={'test1'} />,
    );

    wrapper.find('a').simulate('click', { preventDefault });
    expect(onPanelSelect.calledOnce).to.equal(true);
    expect(preventDefault.calledOnce).to.equal(true);
  });

  describe('when no panels are given', () => {
    it('should render "no panels available"', () => {
      const panels = {};

      const onPanelSelect = () => 'onPanelSelect';

      const wrapper = shallow(<DownPanel panels={panels} onPanelSelect={onPanelSelect} />);

      expect(wrapper.contains('no panels available')).to.equal(true);
    });
  });
});
