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

  it('deserializes an Array to an Array', () => {
    const array = ['a', 'b', 'c'];
    const deserialized = ArrayType.deserialize(array);

    expect(deserialized).toEqual(['a', 'b', 'c']);
  });

  it('deserializes an Object to an Array', () => {
    const object = { 1: 'one', 0: 'zero', 2: 'two' };

    const deserialized = ArrayType.deserialize(object);

    expect(deserialized).toEqual(['zero', 'one', 'two']);
  });
});
