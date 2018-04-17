import React from 'react';
import { shallow } from 'enzyme';
import ArrayType from '../types/Array';

jest.useFakeTimers();

describe('Array', () => {
  it('should subscribe to setKnobs event of channel', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <ArrayType
        onChange={onChange}
        knob={{ name: 'passions', value: ['Fishing', 'Skiing'], separator: ',' }}
      />
    );

    wrapper.simulate('change', { target: { value: 'Fishing,Skiing,Dancing' } });
    jest.runAllTimers();
    expect(onChange).toHaveBeenCalledWith(['Fishing', 'Skiing', 'Dancing']);
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

  it('should change to an empty array when emptied', () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <ArrayType
        onChange={onChange}
        knob={{ name: 'passions', value: ['Fishing', 'Skiing'], separator: ',' }}
      />
    );

    wrapper.simulate('change', { target: { value: '' } });
    jest.runAllTimers();
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
