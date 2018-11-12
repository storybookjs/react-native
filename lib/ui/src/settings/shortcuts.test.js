import React from 'react';
import { shallow } from 'enzyme';
import ShortcutsPage from './shortcuts';
import { IconButton } from './components';
import { controlOrMetaKey } from '../../../components/src/treeview/utils';

const newHotkeys = {
  fullScreen: new Set(['X']),
  togglePanel: new Set(['6']), // Panel visibility
  panelPosition: new Set(['D']),
  navigation: new Set(['A']),
  search: new Set(['/']),
  focusNav: new Set(['1']),
  focusIframe: new Set(['2']),
  focusPanel: new Set(['3']),
  prevComponent: new Set(['alt', 'ArrowUp']),
  nextComponent: new Set(['alt', 'ArrowDown']),
  shortcutsPage: new Set(['shift', ',', controlOrMetaKey()]),
  prevStory: new Set(['alt', 'ArrowLeft']),
  nextStory: new Set(['alt', 'ArrowRight']),
  aboutPage: new Set([',']),
};

describe('ShortcutsPage', () => {
  beforeAll(() => {
    // eslint-disable-next-line no-undef
    localStorage.setItem(
      'shortcutKeys',
      JSON.stringify({
        fullScreen: ['F'],
        togglePanel: ['S'], // Panel visibiliy
        panelPosition: ['D'],
        navigation: ['A'],
        search: ['/'],
        focusNav: ['1'],
        focusIframe: ['2'],
        focusPanel: ['3'],
        prevComponent: ['alt', 'ArrowUp'],
        nextComponent: ['alt', 'ArrowDown'],
        prevStory: ['alt', 'ArrowLeft'],
        nextStory: ['alt', 'ArrowRight'],
        shortcutsPage: ['shift', ',', controlOrMetaKey()],
        aboutPage: [','],
      })
    );
  });

  afterAll(() => {
    // eslint-disable-next-line no-undef
    localStorage.clear();
  });

  describe('State Changes', () => {
    describe('handleOpenModal', () => {
      it('clicking the edit button displays the modal', () => {
        const component = shallow(<ShortcutsPage />);
        const btn = component.find(IconButton).first();
        btn.simulate('click');
        expect(component.state().showModal).toBe(true);
        expect(component.state().activeInputField).toBe('fullScreen');
      });

      it('sets state appropriately', () => {
        const component = shallow(<ShortcutsPage />);
        const inst = component.instance();

        inst.handleOpenModal('fullScreen', 'full screen')();
        expect(component.state().activeTitle).toBe('full screen');
        expect(component.state().activeInputField).toBe('fullScreen');
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

    describe('clearShortcuts', () => {
      it('clears the input field when clicked', () => {
        const component = shallow(<ShortcutsPage />);
        component.setState({ inputValue: new Set('A', 'B', 'C') });
        const inst = component.instance();
        inst.clearShortcuts();

        expect(component.state().inputValue.size).toBe(0);
      });
    });

    describe('restoreDefaults', () => {
      it('restores default values of hotkeys when pressed', () => {
        const component = shallow(<ShortcutsPage />);

        const inst = component.instance();
        component.setState({
          shortcutKeys: {
            ...newHotkeys,
          },
        });
        inst.restoreDefaults();
        expect(component.state().shortcutKeys.fullScreen).toEqual(['F']);
      });
    });

    describe('saveShortcut', () => {
      it('throws an error if there is a duplicate and does not allow save', () => {
        const component = shallow(<ShortcutsPage />);

        const inst = component.instance();
        component.setState({
          inputValue: new Set(['F']),
        });
        inst.saveShortcut();
        expect(component.state().hasSaveError).toBe(true);
      });

      it('saves when there are no duplicates', () => {
        const component = shallow(<ShortcutsPage />);

        const inst = component.instance();
        component.setState({
          inputValue: new Set(['J']),
        });
        inst.saveShortcut();
        expect(component.state().hasSaveError).toBe(false);
      });
    });

    describe('captureKeyPress', () => {
      it('formats key and removes error if there are any', () => {
        const component = shallow(<ShortcutsPage />);

        const inst = component.instance();

        inst.captureKeyPress({ key: 'H' });
        expect(component.state().inputValue).toEqual(new Set(['H']));
        expect(component.state().hasSaveError).toBe(false);
      });
    });
  });
});
