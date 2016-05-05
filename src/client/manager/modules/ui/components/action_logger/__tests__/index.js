import React from 'react';
import ActionLogger from '../';
import { expect } from 'chai';
const { describe, it } = global;
import { shallow } from 'enzyme';
import sinon from 'sinon';

describe('manager.ui.components.action_logger.index', () => {
  it('should render given actions', () => {
    const actions = [
      { id: 'action1', data: { aa: 10 } },
      { id: 'action12', data: { aa: 20 } },
    ];

    const wrap = shallow(<ActionLogger actions={actions} />);
    const foldableNodes = wrap.find('pre').children().nodes;
    expect(foldableNodes.length).to.be.equal(2);

    expect(foldableNodes[0].props).to.deep.equal({ action: actions[0] });
    expect(foldableNodes[1].props).to.deep.equal({ action: actions[1] });
  });

  it('should fire onClear action', () => {
    const onClear = sinon.stub();
    const wrap = shallow(<ActionLogger onClear={onClear} actions={[]} />);
    wrap.find('button').simulate('click');

    expect(onClear.callCount).to.be.equal(1);
  });
});
