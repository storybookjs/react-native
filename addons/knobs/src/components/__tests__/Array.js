import React from 'react';
import { shallow } from 'enzyme'; // eslint-disable-line
import ArrayType from '../types/Array';

describe('Array', () => {
  it('should subscribe to setKnobs event of channel', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <ArrayType
        onChange={onChange}
        knob={{ name: 'passions', value: ['Fishing', 'Skiing'], separator: ',' }}
      />
    );

    wrapper.simulate('change', { target: { value: 'Fhishing,Skiing,Dancing' } });
    expect(onChange).toHaveBeenCalledWith(['Fhishing', 'Skiing', 'Dancing']);
  });

  it('should change to an empty array when emptied', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <ArrayType
        onChange={onChange}
        knob={{ name: 'passions', value: ['Fishing', 'Skiing'], separator: ',' }}
      />
    );

    wrapper.simulate('change', { target: { value: '' } });
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
