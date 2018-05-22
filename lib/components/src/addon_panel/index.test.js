import React from 'react';
import { shallow } from 'enzyme';
import AddonPanel from './index';

describe('manager.ui.components.addon_panel.index', () => {
  test('should render only the selected panel with display set other than "none"', () => {
    const panels = {
      test1: {
        title: 'TEST 1',
        // eslint-disable-next-line react/prop-types
        render: ({ active }) => (active ? <div id="test1">TEST 1</div> : null),
      },
      test2: {
        title: 'TEST 2',
        // eslint-disable-next-line react/prop-types
        render: ({ active }) => (active ? <div id="test2">TEST 2</div> : null),
      },
    };

    const onPanelSelect = () => 'onPanelSelect';

    const wrapper = shallow(
      <AddonPanel panels={panels} onPanelSelect={onPanelSelect} selectedPanel="test2" />
    ).dive();

    expect(wrapper.find('Tab').at(0)).toHaveProp({ selected: false });
    expect(wrapper.find('Tab').at(1)).toHaveProp('selected', true);
    expect(wrapper.find('render').at(0)).toHaveProp('active', false);
    expect(wrapper.find('render').at(1)).toHaveProp('active', true);
  });

  test('should set onPanelSelected as onClick handlers of tabs', () => {
    const panels = {
      test1: {
        title: 'TEST 1',
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

    wrapper
      .dive()
      .find('Tab')
      .dive()
      .simulate('click', { preventDefault });

    expect(onPanelSelect).toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
  });

  describe('when no panels are given', () => {
    test('should render "no panels available"', () => {
      const panels = {};
      const onPanelSelect = () => 'onPanelSelect';
      const wrapper = shallow(<AddonPanel panels={panels} onPanelSelect={onPanelSelect} />).dive();

      expect(wrapper.contains('no panels available')).toBe(true);
    });
  });
});
