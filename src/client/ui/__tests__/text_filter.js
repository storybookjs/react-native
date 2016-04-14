const { describe, it } = global;
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import TextFilter from '../text_filter';

describe('<TextFilter />', function () {
  describe('render', function () {
    it('should render input without filterText', function () {
      const wrap = shallow(<TextFilter />);
      const input = wrap.find('input').first();
      expect(input.props().placeholder).to.equal('Filter');
    });

    it('should render input with filterText', function () {
      const wrap = shallow(<TextFilter filterText="Filter Text" />);
      const input = wrap.find('input').first();
      expect(input.props().value).to.equal('Filter Text');
    });
  });

  describe('functions', function () {
    it('should call the onChange prop when input changes', function () {
      const onChange = sinon.spy();
      const wrap = shallow(<TextFilter onChange={onChange} />);
      const input = wrap.find('input').first();
      input.value = 'new value';
      input.simulate('change', { target: input });
      expect(onChange.calledOnce).to.equal(true);
      expect(onChange.firstCall.calledWith('new value'));
    });

    it('should call the onClear prop when the button is clicked', function () {
      const onClear = sinon.spy();
      const wrap = shallow(<TextFilter onClear={onClear} />);

      // use the latest div to avoid parents
      // example: <div><div>x</div></div>
      const clear = wrap.find('div')
        .filterWhere(el => el.text() === 'x')
        .last();

      clear.simulate('click');
      expect(onClear.calledOnce).to.equal(true);
    });
  });
});
