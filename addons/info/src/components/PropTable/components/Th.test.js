import React from 'react';
import { shallow } from 'enzyme';

import Th from './Th';

describe('PropTable/Th', () => {
  it('renders a th html node with react element children', () => {
    const wrapper = shallow(
      <Th>
        <div>foo bar</div>
        <div>baz</div>
      </Th>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a th html node with html node children', () => {
    const wrapper = shallow(<Th>foo bar baz</Th>);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders a th html node with one child node', () => {
    const wrapper = shallow(<Th>foo bar</Th>);
    expect(wrapper).toMatchSnapshot();
  });
});
