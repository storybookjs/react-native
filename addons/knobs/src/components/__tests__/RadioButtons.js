import React from 'react';
import { shallow } from 'enzyme';
import RadioButtonType from '../types/RadioButtons';

describe('RadioButtons', () => {
  let knob;

  beforeEach(() => {
    knob = {
      name: 'Color',
      value: '#319C17',
      options: {
        Green: '#319C17',
        Red: '#FF2B2B',
      },
    };
  });

  describe('displays value of button input', () => {
    it('correctly renders labels', () => {
      const wrapper = shallow(<RadioButtonType knob={knob} />);

      const greenLabel = wrapper.find('label').first();
      expect(greenLabel.text()).toEqual('Green');
    });

    it('sets value on the radio buttons', () => {
      const wrapper = shallow(<RadioButtonType knob={knob} />);

      const greenInput = wrapper.find('input').first();
      expect(greenInput.prop('value')).toEqual('#319C17');
    });

    it('marks the correct checkbox as checked', () => {
      const wrapper = shallow(<RadioButtonType knob={knob} />);

      const greenInput = wrapper.find('input').first();
      const redInput = wrapper.find('input').last();

      expect(greenInput.prop('checked')).toEqual(true);
      expect(redInput.prop('checked')).toEqual(false);
    });
  });
});
