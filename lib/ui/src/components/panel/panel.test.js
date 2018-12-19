import React from 'react';
import { mount, shallow } from 'enzyme';
import AddonPanel from './panel';

describe('manager.ui.components.addon_panel.index', () => {
  const actions = {
    togglePosition: jest.fn(),
    toggleVisibility: jest.fn(),
    onSelect: jest.fn(),
  };

  test('should render only the selected panel with display set other than "none"', () => {
    const panels = {
      test1: {
        title: 'TEST 1',
        // eslint-disable-next-line react/prop-types
        render: ({ active, key }) =>
          active ? (
            <div id="test1" key={key}>
              TEST 1
            </div>
          ) : null,
      },
      test2: {
        title: 'TEST 2',
        // eslint-disable-next-line react/prop-types
        render: ({ active, key }) =>
          active ? (
            <div id="test2" key={key}>
              TEST 2
            </div>
          ) : null,
      },
    };

    const wrapper = mount(<AddonPanel panels={panels} actions={actions} selectedPanel="test2" />);

    expect(wrapper.find('#test2')).toExist();
    expect(wrapper.find('Tab').at(0)).toHaveProp('active', false);
    expect(wrapper.find('Tab').at(1)).toHaveProp('active', true);
  });

  test('should set onPanelSelected as onClick handlers of tabs', () => {
    actions.onSelect.mockClear();
    const panels = {
      test1: {
        title: 'TEST 1',
        // eslint-disable-next-line react/prop-types
        render({ key }) {
          return <div key={key}>TEST 1</div>;
        },
      },
    };
    const preventDefault = jest.fn();
    const wrapper = shallow(<AddonPanel panels={panels} actions={actions} selectedPanel="test1" />);

    wrapper
      .dive()
      .find('Tab')
      .dive()
      .simulate('click', { preventDefault });

    expect(actions.onSelect).toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
  });

  describe('when no panels are given', () => {
    test('should render "no panels available"', () => {
      const panels = {};
      const wrapper = shallow(<AddonPanel panels={panels} actions={actions} />).dive();

      expect(wrapper.contains('no panels available')).toBe(true);
    });
  });
});
