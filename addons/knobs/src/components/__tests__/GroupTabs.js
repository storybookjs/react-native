import React from 'react';
import { shallow } from 'enzyme';
import GroupTabs from '../GroupTabs';

describe('GroupTabs', () => {
  test('should render only the selected group with display set other than "none"', () => {
    const groups = {
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

    const onGroupSelect = () => 'onGroupSelect';

    const wrapper = shallow(
      <GroupTabs groups={groups} onGroupSelect={onGroupSelect} selectedGroup="test2" />
    );

    expect(wrapper.find('#test1').parent()).toHaveStyle('display', 'none');
    expect(wrapper.find('#test2').parent()).not.toHaveStyle('display', 'none');
  });

  test('should set onGroupSelected as onClick handlers of tabs', () => {
    const groups = {
      test1: {
        render() {
          return <div>TEST 1</div>;
        },
      },
    };
    const onGroupSelect = jest.fn();
    const preventDefault = jest.fn();
    const wrapper = shallow(
      <GroupTabs groups={groups} onGroupSelect={onGroupSelect} selectedGroup="test1" />
    );
    wrapper.find('button').simulate('click', { preventDefault });

    expect(onGroupSelect).toHaveBeenCalled();
    expect(preventDefault).toHaveBeenCalled();
  });

  describe('when no groups are given', () => {
    test('should render "no groups available"', () => {
      const groups = {};
      const onGroupSelect = () => 'onGroupSelect';
      const wrapper = shallow(<GroupTabs groups={groups} onGroupSelect={onGroupSelect} />);

      expect(wrapper.contains('no groups available')).toBe(true);
    });
  });
});
