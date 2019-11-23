import React from 'react';
import { shallow } from 'enzyme';
import SelectType from '../types/Select';

describe('Select', () => {
  let knob;

  describe('Object values', () => {
    beforeEach(() => {
      knob = {
        name: 'Colors',
        value: '#00ff00',
        options: {
          Green: '#00ff00',
          Red: '#ff0000',
        },
      };
    });

    it('correctly maps option keys and values', () => {
      const wrapper = shallow(<SelectType knob={knob} />);

      const green = wrapper.find('option').first();
      expect(green.text()).toEqual('Green');
      expect(green.prop('value')).toEqual('Green');
    });

    it('should set the default value for array-values correctly', () => {
      knob = {
        name: 'Array values',
        options: {
          '100 x 100': [100, 100],
          '200 x 200': [200, 200],
        },
        value: [200, 200],
      };

      const wrapper = shallow(<SelectType knob={knob} />);
      const value = wrapper.prop('value');
      expect(value).toEqual('200 x 200');
    });
  });

  describe('Array values', () => {
    beforeEach(() => {
      knob = {
        name: 'Colors',
        value: 'green',
        options: ['green', 'red'],
      };
    });

    it('correctly maps option keys and values', () => {
      const wrapper = shallow(<SelectType knob={knob} />);

      const green = wrapper.find('option').first();
      expect(green.text()).toEqual('green');
      expect(green.prop('value')).toEqual('green');
    });
  });
});
