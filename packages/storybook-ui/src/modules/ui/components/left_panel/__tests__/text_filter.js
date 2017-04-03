import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import TextFilter from '../text_filter';

describe('manager.ui.components.left_panel.test_filter', () => {
  describe('render', () => {
    it('should render input without filterText', () => {
      const wrap = shallow(<TextFilter />);
      const input = wrap.find('input').first();
      expect(input.props().placeholder).to.equal('Filter');
    });

    it('should render input with filterText', () => {
      const wrap = shallow(<TextFilter text="Filter Text" />);
      const input = wrap.find('input').first();
      expect(input.props().value).to.equal('Filter Text');
    });
  });

  describe('functions', () => {
    it('should call the onChange prop when input changes', () => {
      const onChange = sinon.spy();
      const wrap = shallow(<TextFilter onChange={onChange} />);
      const input = wrap.find('input').first();
      input.value = 'new value';
      input.simulate('change', { target: input });
      expect(onChange.calledOnce).to.equal(true);
      expect(onChange.firstCall.calledWith('new value'));
    });

    it('should call the onClear prop when the button is clicked', () => {
      const onClear = sinon.spy();
      const wrap = shallow(<TextFilter onClear={onClear} />);

      wrap.setState({ query: 'hello' });

      const clear = wrap.find('.clear');

      clear.simulate('click');
      expect(onClear.calledOnce).to.equal(true);
    });
  });
});
