import React from 'react';
import { shallow } from 'enzyme';

import Tr from './Tr';
import Td from './Td';

describe('PropTable/Tr', () => {
  it('renders a tr html node with react element children', () => {
    const wrapper = shallow(
      <Tr>
        <Td>foo bar</Td>
        <Td>baz</Td>
      </Tr>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a tr html node with html node children', () => {
    const wrapper = shallow(<Tr>foo bar baz</Tr>);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a tr html node with one child node', () => {
    const wrapper = shallow(<Tr>foo bar</Tr>);
    expect(wrapper).toMatchSnapshot();
  });
});
