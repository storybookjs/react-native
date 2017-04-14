import React from 'react';
import { shallow } from 'enzyme';
import Array from '../types/Array';
import { expect } from 'chai';
import sinon from 'sinon';
const { describe, it } = global;

describe('Array', () => {
  it('should subscribe to setKnobs event of channel', () => {
    const onChange = sinon.spy();
    const wrapper = shallow(
      <Array
        onChange={onChange}
        knob={{ name: 'passions', value: ['Fishing', 'Skiing'], separator: ',' }}
      />,
    );

    wrapper.simulate('change', { target: { value: 'Fhishing,Skiing,Dancing' } });
    expect(onChange.calledWith(['Fhishing', 'Skiing', 'Dancing'])).to.equal(true);
  });
});
