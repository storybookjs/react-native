const { describe, it } = global;
import React from 'react';
import { shallow } from 'enzyme';
import Header from '../header.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('manager.ui.components.left_panel.header', () => {
  it('should fire openShortcutsHelp when clicked on shortcut button', () => {
    const openShortcutsHelp = sinon.stub();
    const wrap = shallow(<Header openShortcutsHelp={openShortcutsHelp} />);

    wrap.find('button').simulate('click');
    expect(openShortcutsHelp.callCount).to.be.equal(1);
  });
});
