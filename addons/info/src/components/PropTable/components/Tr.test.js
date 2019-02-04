import React from 'react';
import { shallow } from 'enzyme';

import Tr from './Tr';

describe('PropTable/Tr', () => {
  describe('renders a tr html node with react element children', () => {
    const wrapper = shallow(
      <Tr>
        <div>foo bar</div>
        <div>baz</div>
      </Tr>
    );
    expect(wrapper).toMatchSnapshot();
  });

  describe('renders a tr html node with html node children', () => {
    const wrapper = shallow(<Tr>foo bar baz</Tr>);
    expect(wrapper).toMatchSnapshot();
  });

  describe('renders a tr html node with one child node', () => {
    const wrapper = shallow(<Tr>foo bar</Tr>);
    expect(wrapper).toMatchSnapshot();
  });
});
