import React from 'react';
import { shallow } from 'enzyme';

import Td from './Td';

describe('PropTable/Td', () => {
  it('renders a td html node child element', () => {
    const wrapper = shallow(
      <Td>
        <div>foo bar</div>
      </Td>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a monospace td html node child element', () => {
    const wrapper = shallow(
      <Td isMonospace>
        <div>foo bar</div>
      </Td>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a td html node with multiple children elements', () => {
    const wrapper = shallow(
      <Td>
        <div>foo bar</div>
        <div>baz</div>
      </Td>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a monospace td html node with multiple children elements', () => {
    const wrapper = shallow(
      <Td isMonospace>
        <div>foo bar</div>
        <div>baz</div>
      </Td>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a td html node with one child node', () => {
    const wrapper = shallow(<Td>foo bar</Td>);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a monospace td html node with one child node', () => {
    const wrapper = shallow(<Td isMonospace>foo bar</Td>);
    expect(wrapper).toMatchSnapshot();
  });
});
