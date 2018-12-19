import React from 'react';
import { mount } from 'enzyme';
import ReactSelect from 'react-select';
import OptionsType from '../types/Options';

const mockOn = jest.fn();

describe('Options', () => {
  let knob;
  let wrapper;
  let firstLabel;
  let firstInput;
  let lastInput;

  describe('renders checkbox input', () => {
    beforeEach(() => {
      knob = {
        name: 'Color',
        defaultValue: ['#0ff'],
        options: {
          Red: '#f00',
          Green: '#090',
          Blue: '#0ff',
        },
        optionsObj: {
          display: 'check',
        },
      };

      wrapper = mount(<OptionsType knob={knob} onChange={mockOn} />);
      firstLabel = wrapper.find('label').first();
      firstInput = wrapper.find('input').first();
      lastInput = wrapper.find('input').last();
    });

    it('correctly renders label', () => {
      expect(firstLabel.text()).toEqual('Red');
    });

    it('correctly sets checkbox value', () => {
      expect(firstInput.prop('value')).toEqual('#f00');
    });

    it('marks the correct default checkbox as checked', () => {
      expect(firstInput.prop('checked')).toEqual(false);
      expect(lastInput.prop('checked')).toEqual(true);
    });

    it('updates on change event', () => {
      expect(wrapper.props().knob.defaultValue).toEqual(['#0ff']);

      firstInput.simulate('change');

      expect(mockOn).toBeCalled();
      expect(wrapper.props().knob.defaultValue).toEqual(['#0ff', '#f00']);
    });
  });

  describe('renders radio input', () => {
    beforeEach(() => {
      knob = {
        name: 'Color',
        value: '#0ff',
        options: {
          Red: '#f00',
          Green: '#090',
          Blue: '#0ff',
        },
        optionsObj: {
          display: 'radio',
        },
      };

      wrapper = mount(<OptionsType knob={knob} onChange={mockOn} />);
      firstLabel = wrapper.find('label').first();
      firstInput = wrapper.find('input').first();
      lastInput = wrapper.find('input').last();
    });

    it('correctly renders label', () => {
      expect(firstLabel.text()).toEqual('Red');
    });

    it('correctly sets radio input value', () => {
      expect(firstInput.prop('value')).toEqual('#f00');
    });

    it('marks the correct default radio input as checked', () => {
      expect(firstInput.prop('checked')).toEqual(false);
      expect(lastInput.prop('checked')).toEqual(true);
    });

    it('updates on change event', () => {
      firstInput.simulate('change');
      expect(mockOn).toBeCalled();
    });
  });

  describe('renders select input', () => {
    let selectInput;
    beforeEach(() => {
      knob = {
        name: 'Color',
        value: '#0ff',
        options: {
          Red: '#f00',
          Green: '#090',
          Blue: '#0ff',
        },
        optionsObj: {
          display: 'select',
        },
      };

      wrapper = mount(<OptionsType knob={knob} onChange={mockOn} />);
      selectInput = wrapper.find(ReactSelect).find('input');
    });

    it('updates when dropdown is opened and first option selected', () => {
      // Simulate the arrow down event to open the dropdown menu.
      selectInput.simulate('keyDown', { key: 'ArrowDown', keyCode: 40 });

      // Simulate the enter key to select the first option.
      selectInput.simulate('keyDown', { key: 'Enter', keyCode: 13 });

      // selectInput.simulate('change');
      expect(mockOn).toBeCalled();
    });
  });
});
