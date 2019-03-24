import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ThemeProvider, themes, convert } from '@storybook/theming';
import HighlightToggle from './HighlightToggle.tsx';
import store from '../../redux-config.tsx';

function ThemedHighlightToggle(props) {
  return (
    <ThemeProvider theme={convert(themes.normal)}>
      <HighlightToggle {...props} />
    </ThemeProvider>
  );
}

describe('HighlightToggle component', () => {
  test('should render', () => {
    // given
    const wrapper = mount(
      <Provider store={store}>
        <ThemedHighlightToggle />
      </Provider>
    );

    // then
    expect(wrapper.exists()).toBe(true);
  });

  test('should match snapshot', () => {
    // given
    const wrapper = mount(
      <Provider store={store}>
        <ThemedHighlightToggle />
      </Provider>
    );

    // then
    expect(wrapper).toMatchSnapshot();
  });
});
