import React from 'react';
import { shallow } from 'enzyme';
import ShortcutsPage from './shortcuts';

describe('ShortcutsPage', () => {
  it('renders correctly', () => {
    const comp = shallow(<ShortcutsPage />);
    expect(comp).toExist();
  });
});
