import { shallow, mount } from 'enzyme';
import React from 'react';
import TextFilter from './text_filter';

jest.mock('lodash.debounce', () => jest.fn(fn => fn));

describe('manager.ui.components.stories_panel.test_filter', () => {
  describe('render', () => {
    test('should render input without filterText', () => {
      const wrap = shallow(<TextFilter />);
      const input = wrap.find('input').first();

      expect(input).toHaveProp('placeholder', 'Filter');
    });

    test('should render input with filterText', () => {
      const wrap = mount(<TextFilter text="Filter Text" />);
      const input = wrap.find('input').first();

      expect(input).toHaveProp('value', 'Filter Text');
    });
  });

  describe('functions', () => {
    test('should call the onChange prop when input changes', () => {
      const onChange = jest.fn();
      const wrap = mount(<TextFilter onChange={onChange} />);

      const input = wrap.find('input').first();
      input.value = 'new value';
      input.simulate('change', { target: input });

      expect(onChange).toHaveBeenCalledWith('new value');
    });

    test('should call the onClear prop when the button is clicked', () => {
      const onClear = jest.fn();
      const wrap = mount(<TextFilter onClear={onClear} />);
      wrap.setState({ query: 'hello' });

      const clear = wrap.find('.clear').first();
      clear.simulate('click');

      expect(onClear).toHaveBeenCalled();
    });
  });
});
