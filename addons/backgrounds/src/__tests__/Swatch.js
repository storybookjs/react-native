import React from 'react';
import { shallow, mount } from 'enzyme';

import Swatch from '../Swatch';

const mockedSetBackround = jest.fn();

describe('Swatch', () => {
  it('should exist', () => {
    const swatch = shallow(<Swatch value="bar" name="foo" setBackground={mockedSetBackround} />);

    expect(swatch).toBeDefined();
  });

  it('should render the name of the swatch', () => {
    const markup = shallow(
      <Swatch value="bar" name="foo" setBackground={mockedSetBackround} />
    ).html();

    expect(markup.match(/foo/gim)).toHaveLength(1);
  });

  it('should render the value of the swatch and set it to be the background', () => {
    const markup = shallow(
      <Swatch value="bar" name="foo" setBackground={mockedSetBackround} />
    ).html();

    expect(markup.match(/background:bar/gim)).toHaveLength(1);
    expect(markup.match(/bar/gim)).toHaveLength(2);
  });

  it('should emit message on click', () => {
    const spy = jest.fn();
    const swatch = mount(<Swatch value="#e6e6e6" name="Gray" setBackground={spy} />);
    swatch.simulate('click');

    expect(spy).toBeCalledWith('#e6e6e6');
  });
});
