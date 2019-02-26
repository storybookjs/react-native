import React from 'react';
import { shallow } from 'enzyme';

import Tbody from './Tbody';

describe('PropTable/Tbody', () => {
  it('renders a tbody html node with children', () => {
    const wrapper = shallow(
      <Tbody>
        <div>foo bar</div>
      </Tbody>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a tbody html node with multiple children elements', () => {
    const wrapper = shallow(
      <Tbody>
        <div>foo bar</div>
        <div>baz</div>
      </Tbody>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
