import React from 'react';
import { shallow } from 'enzyme';
import Header from './header';

describe('manager.ui.components.stories_panel.header', () => {
  test('should fire openShortcutsHelp when clicked on shortcut button', () => {
    const openShortcutsHelp = jest.fn();
    const wrap = shallow(<Header openShortcutsHelp={openShortcutsHelp} />);

    wrap.find('button').simulate('click');

    expect(openShortcutsHelp).toHaveBeenCalled();
  });
});
