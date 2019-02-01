import React from 'react';
import { mount } from 'enzyme';
import RadioType from '../types/Radio';

describe('Radio', () => {
  let knob;

  beforeEach(() => {
    knob = {
      name: 'Color',
      value: '#319C16',
      options: {
        Green: '#319C16',
        Red: '#FF2B2B',
      },
    };
  });

  describe('displays value of button input', () => {
    it('correctly renders labels', () => {
      const wrapper = mount(<RadioType knob={knob} />);

      const greenLabel = wrapper.find('label').first();
      expect(greenLabel.text()).toEqual('Green');
    });

    it('sets value on the radio buttons', () => {
      const wrapper = mount(<RadioType knob={knob} />);

      const greenInput = wrapper.find('input').first();
      expect(greenInput.prop('value')).toEqual('#319C16');
    });

    it('marks the correct checkbox as checked', () => {
      const wrapper = mount(<RadioType knob={knob} />);

      const greenInput = wrapper.find('input').first();
      const redInput = wrapper.find('input').last();

      expect(greenInput.prop('checked')).toEqual(true);
      expect(redInput.prop('checked')).toEqual(false);
    });
  });
});
