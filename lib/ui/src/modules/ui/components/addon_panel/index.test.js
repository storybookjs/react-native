import React from 'react';
import { shallow } from 'enzyme';
import AddonPanel from './index';

describe('manager.ui.components.addon_panel.index', () => {
  test('should render only the selected panel with display set other than "none"', () => {
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
      <AddonPanel panels={panels} onPanelSelect={onPanelSelect} selectedPanel="test2" />
    );

    expect(wrapper.find('#test1').parent()).toHaveStyle('display', 'none');
    expect(wrapper.find('#test2').parent()).not.toHaveStyle('display', 'none');
  });

  test('should set onPanelSelected as onClick handlers of tabs', () => {
    const panels = {
      test1: {
        render() {
          return <div>TEST 1</div>;
        },
      },
    };
    const onPanelSelect = jest.fn();
    const preventDefault = jest.fn();
    const wrapper = shallow(
      <AddonPanel panels={panels} onPanelSelect={onPanelSelect} selectedPanel="test1" />
    );
    wrapper.find('a').simulate('click', { preventDefault });

    expect(onPanelSelect).toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
  });

  describe('when no panels are given', () => {
    test('should render "no panels available"', () => {
      const panels = {};
      const onPanelSelect = () => 'onPanelSelect';
      const wrapper = shallow(<AddonPanel panels={panels} onPanelSelect={onPanelSelect} />);

      expect(wrapper.contains('no panels available')).toBe(true);
    });
  });
});
