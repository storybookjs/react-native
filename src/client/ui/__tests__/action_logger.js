const { describe, it } = global;
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import ActionLogger from '../action_logger';

describe('<ActionLogger />', function () {
  describe('render', function () {
    it('should render logs - empty', function () {
      const wrap = shallow(<ActionLogger actions={[]} />);
      const logs = wrap.find('pre').first();
      expect(logs.text()).to.equal('');
    });

    it('should render logs', function () {
      const action1 = { name: 'a1' };
      const action2 = { name: 'a2' };
      const action3 = { name: 'a3' };

      const data = [action1, action2, action3];

      const wrap = shallow(<ActionLogger actions={data} />);
      const logs = wrap.find('pre').first();

      expect(logs.children().length).to.equal(3);
    });
  });

  describe('functions', function () {
    it('should call the onClear prop when the button is clicked', function () {
      const onClear = sinon.spy();
      const wrap = shallow(<ActionLogger actions={[]} onClear={onClear} />);
      const clear = wrap.find('button').first();
      clear.simulate('click');
      expect(onClear.calledOnce).to.equal(true);
    });
  });
});
