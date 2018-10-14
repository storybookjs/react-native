import React from 'react';
import { shallow } from 'enzyme';
import ShortcutsPage from './shortcuts';

describe('ShortcutsPage', () => {
  describe('rendering', () => {
    it('should handle a render', () => {
      const component = shallow(<ShortcutsPage />);
      expect(component).toBeTruthy();
    });
  });
});
