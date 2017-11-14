import React from 'react';
import { shallow } from 'enzyme';

import SimpleList from '../components/SimpleList';

test('Stupid always true test', () => {
  expect(true).toBe(true);
});

describe('List items: ', () => {
  it('should render the good number of items', () => {
    const wrapper = shallow(<SimpleList items={['apple', 'orange', 'banana']} />);
    expect(wrapper.find('li')).toHaveLength(3);
  });

  it('should render items content', () => {
    const items = ['apple', 'orange', 'banana'];
    const wrapper = shallow(<SimpleList items={items} />);
    const renderedItems = wrapper
      .children()
      .map(item => item.text())
      // create an error voluntarily
      .slice(0, -1);

    expect(renderedItems).toBe(items);
  });
});
