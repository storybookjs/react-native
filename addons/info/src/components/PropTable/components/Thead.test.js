import React from 'react';
import { shallow } from 'enzyme';

import Thead from './Thead';

describe('PropTable/Thead', () => {
  it('renders a thead html node with children', () => {
    const wrapper = shallow(
      <Thead>
        <div>foo bar</div>
      </Thead>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a thead html node with multiple children elements', () => {
    const wrapper = shallow(
      <Thead>
        <div>foo bar</div>
        <div>baz</div>
      </Thead>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
