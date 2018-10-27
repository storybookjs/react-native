import React from 'react';
import { shallow } from 'enzyme';
import ShortcutsPage from './shortcuts';
import { EditButton } from './components';

describe('ShortcutsPage', () => {
  describe('rendering', () => {
    it('should handle a render', () => {
      const component = shallow(<ShortcutsPage />);
      expect(component).toBeTruthy();
    });
  });

  describe('State Changes', () => {
    describe('handleOpenModal', () => {
      it('clicking the edit button displays the modal', () => {
        const component = shallow(<ShortcutsPage />);
        const btn = component.find(EditButton).first();
        btn.simulate('click');
        expect(component.state().showModal).toBe(true);
      });
    });

    describe('handleCloseModal', () => {
      it('clicking the close button hides the modal', () => {
        const component = shallow(<ShortcutsPage />);
        const btn = component.find('.modalClose').first();
        btn.simulate('click');
        expect(component.state().showModal).toBe(false);
      });
    });
  });
});
