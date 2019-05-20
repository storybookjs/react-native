import React from 'react';
import { shallow } from 'enzyme';
import { render } from 'react-testing-library';

import { ThemeProvider, themes, convert } from '@storybook/theming';
import ShortcutsScreen from './shortcuts';

// A limited set of keys we use in this test file
const shortcutKeys = {
  fullScreen: ['F'],
  togglePanel: ['A'],
  toggleNav: ['S'],
  toolbar: ['T'],
  search: ['/'],
  focusNav: ['1'],
  focusIframe: ['2'],
};

const makeActions = () => ({
  setShortcut: jest.fn(),
  restoreDefaultShortcut: jest.fn().mockImplementation(action => shortcutKeys[action]),
  restoreAllDefaultShortcuts: jest.fn().mockReturnValue(shortcutKeys),
  onClose: jest.fn(),
});

describe('ShortcutsScreen', () => {
  it('renders correctly', () => {
    const comp = shallow(
      <ThemeProvider theme={convert(themes.light)}>
        <ShortcutsScreen shortcutKeys={shortcutKeys} {...makeActions()} />
      </ThemeProvider>
    );
    expect(comp).toExist();
  });

  it('handles a full mount', () => {
    const comp = render(
      <ThemeProvider theme={convert(themes.light)}>
        <ShortcutsScreen shortcutKeys={shortcutKeys} {...makeActions()} />
      </ThemeProvider>
    );
    expect(comp).toBeDefined();
    comp.unmount();
  });

  describe('onFocus', () => {
    it('calls setstate and clears the input on focus', () => {
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...makeActions()} />);
      const instance = comp.instance();

      instance.onFocus('toolbar')();
      expect(comp.state('shortcutKeys').toolbar.shortcut).toBeNull();
      expect(comp.state('activeFeature')).toBe('toolbar');
    });
  });

  describe('onKeyDown', () => {
    it('does nothing if a modifier key is pressed', () => {
      const actions = makeActions();
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      const instance = comp.instance();
      instance.onFocus('focusIframe')();
      instance.onKeyDown({ isShift: true, key: 'Shift' });
      expect(actions.setShortcut).not.toHaveBeenCalled();
      expect(comp.state('shortcutKeys').focusIframe.shortcut).toBeNull();
    });

    it('changes the shortcut in state if a key is pressed', () => {
      const actions = makeActions();
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      const instance = comp.instance();
      instance.onFocus('focusIframe')();
      instance.onKeyDown({ key: 'P' });
      expect(actions.setShortcut).not.toHaveBeenCalled();
      expect(comp.state('shortcutKeys').focusIframe.shortcut).toEqual(['P']);
      expect(comp.state('shortcutKeys').focusIframe.error).toBe(false);
    });

    it('sets an error and the shortcut in state if a duplicate key is pressed', () => {
      const actions = makeActions();
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      const instance = comp.instance();
      instance.onFocus('focusIframe')();
      instance.onKeyDown({ key: 'F' });
      expect(actions.setShortcut).not.toHaveBeenCalled();
      expect(comp.state('shortcutKeys').focusIframe.shortcut).toEqual(['F']);
      expect(comp.state('shortcutKeys').focusIframe.error).toBe(true);
    });
  });

  describe('onBlur', () => {
    it('if the input is empty, restores the respective default', async () => {
      const actions = makeActions();
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      const instance = comp.instance();
      instance.onFocus('focusIframe')();
      await instance.onBlur();

      expect(actions.setShortcut).not.toHaveBeenCalled();
      expect(actions.restoreDefaultShortcut).toHaveBeenCalledWith('focusIframe');
      expect(comp.state('shortcutKeys').focusIframe.shortcut).toEqual(['2']);
      expect(comp.state('shortcutKeys').focusIframe.error).toBe(false);
    });

    it('if the shortcut is errored, restores the respective default', async () => {
      const actions = makeActions();
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      const instance = comp.instance();
      instance.onFocus('focusIframe')();
      instance.onKeyDown({ key: 'F' });
      await instance.onBlur();

      expect(actions.setShortcut).not.toHaveBeenCalled();
      expect(actions.restoreDefaultShortcut).toHaveBeenCalledWith('focusIframe');
      expect(comp.state('shortcutKeys').focusIframe.shortcut).toEqual(['2']);
      expect(comp.state('shortcutKeys').focusIframe.error).toBe(false);
    });

    it('it saves the shortcut if it is valid', () => {
      const actions = makeActions();
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      const instance = comp.instance();
      instance.onFocus('focusIframe')();
      instance.onKeyDown({ key: 'P' });
      instance.onBlur();

      expect(actions.setShortcut).toHaveBeenCalledWith('focusIframe', ['P']);
      expect(comp.state('shortcutKeys').focusIframe.shortcut).toEqual(['P']);
      expect(comp.state('shortcutKeys').focusIframe.error).toBe(false);
    });
  });

  describe('restoreDefaults', () => {
    it('if the input is empty, restores the respective default', async () => {
      const actions = makeActions();
      const comp = shallow(<ShortcutsScreen shortcutKeys={shortcutKeys} {...actions} />);
      const instance = comp.instance();
      instance.onFocus('focusIframe')();
      instance.onKeyDown({ key: 'P' });

      await comp.find('#restoreDefaultsHotkeys').simulate('click');
      expect(comp.state('shortcutKeys').focusIframe.shortcut).toEqual(['2']);
    });
  });
});
