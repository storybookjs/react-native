import React from 'react';
import { shallow } from 'enzyme';
import RadioButtonType from '../types/RadioButtons';

describe('RadioButtons', () => {
  let knob;

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

  describe('displays value', () => {
    it('correctly renders labels', () => {
      const wrapper = shallow(<RadioButtonType knob={knob} />);

      const greenLabel = wrapper.find('label').first();
      expect(greenLabel.text()).toEqual('Green');
    });

    it('sets value on the radio buttons', () => {
      const wrapper = shallow(<RadioButtonType knob={knob} />);

      const greenInput = wrapper.find('input').first();
      expect(greenInput.prop('value')).toEqual('#00ff00');
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
