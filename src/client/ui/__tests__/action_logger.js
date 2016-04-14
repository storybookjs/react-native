const { describe, it } = global;
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import ActionLogger from '../action_logger';

describe('<ActionLogger />', function () {
  describe('render', function () {
    it('should render logs - empty', function () {
      const wrap = shallow(<ActionLogger actionLogs={[]} />);
      const logs = wrap.find('pre').first();
      expect(logs.text()).to.equal('');
    });

    it('should render logs', function () {
      const data = ['a1', 'a2', 'a3'];
      const wrap = shallow(<ActionLogger actionLogs={data} />);
      const logs = wrap.find('pre').first();
      expect(logs.text()).to.equal('a1a2a3');
    });
  });

  describe('functions', function () {
    it('should call the onClear prop when the button is clicked', function () {
      const onClear = sinon.spy();
      const wrap = shallow(<ActionLogger actionLogs={[]} onClear={onClear} />);
      const clear = wrap.find('button').first();
      clear.simulate('click');
      expect(onClear.calledOnce).to.equal(true);
    });
  });
});
