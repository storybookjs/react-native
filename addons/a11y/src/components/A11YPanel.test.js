import React from 'react';
import { mount } from 'enzyme';
import { EventEmitter } from 'events';

import { ThemeProvider, themes, convert } from '@storybook/theming';

import { A11YPanel } from './A11YPanel';
import { EVENTS } from '../constants';

function createApi() {
  const emitter = new EventEmitter();
  jest.spyOn(emitter, 'emit');
  jest.spyOn(emitter, 'on');
  jest.spyOn(emitter, 'off');
  return emitter;
}

const axeResult = {
  incomplete: [
    {
      id: 'color-contrast',
      impact: 'serious',
      tags: ['cat.color', 'wcag2aa', 'wcag143'],
      description:
        'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
      help: 'Elements must have sufficient color contrast',
      helpUrl: 'https://dequeuniversity.com/rules/axe/3.2/color-contrast?application=axeAPI',
      nodes: [],
    },
  ],
  passes: [
    {
      id: 'aria-allowed-attr',
      impact: null,
      tags: ['cat.aria', 'wcag2a', 'wcag412'],
      description: "Ensures ARIA attributes are allowed for an element's role",
      help: 'Elements must only use allowed ARIA attributes',
      helpUrl: 'https://dequeuniversity.com/rules/axe/3.2/aria-allowed-attr?application=axeAPI',
      nodes: [],
    },
  ],
  violations: [
    {
      id: 'color-contrast',
      impact: 'serious',
      tags: ['cat.color', 'wcag2aa', 'wcag143'],
      description:
        'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
      help: 'Elements must have sufficient color contrast',
      helpUrl: 'https://dequeuniversity.com/rules/axe/3.2/color-contrast?application=axeAPI',
      nodes: [],
    },
  ],
};

function ThemedA11YPanel(props) {
  return (
    <ThemeProvider theme={convert(themes.light)}>
      <A11YPanel {...props} />
    </ThemeProvider>
  );
}

describe('A11YPanel', () => {
  it('should register event listener on mount', () => {
    // given
    const api = createApi();
    expect(api.on).not.toHaveBeenCalled();

    // when
    mount(<ThemedA11YPanel api={api} />);

    // then
    expect(api.on.mock.calls.length).toBe(3);
    expect(api.on.mock.calls[0][0]).toBe(EVENTS.RESULT);
    expect(api.on.mock.calls[1][0]).toBe(EVENTS.ERROR);
    expect(api.on.mock.calls[2][0]).toBe(EVENTS.MANUAL);
  });

  it('should deregister event listener on unmount', () => {
    // given
    const api = createApi();
    expect(api.off).not.toHaveBeenCalled();

    // when
    const wrapper = mount(<ThemedA11YPanel api={api} />);
    wrapper.unmount();

    // then
    expect(api.off.mock.calls.length).toBe(3);
    expect(api.off.mock.calls[0][0]).toBe(EVENTS.RESULT);
    expect(api.off.mock.calls[1][0]).toBe(EVENTS.ERROR);
    expect(api.off.mock.calls[2][0]).toBe(EVENTS.MANUAL);
  });

  it('should handle "initial" status', () => {
    // given
    const api = createApi();

    // when
    const wrapper = mount(<ThemedA11YPanel api={api} active />);

    // then
    expect(api.emit).not.toHaveBeenCalled();
    expect(wrapper.text()).toMatch(/Initializing/);
  });

  it('should handle "manual" status', () => {
    // given
    const api = createApi();
    const wrapper = mount(<ThemedA11YPanel api={api} active />);

    // when
    api.emit(EVENTS.MANUAL, true);
    wrapper.update();

    // then
    expect(wrapper.text()).toMatch(/Manually run the accessibility scan/);
    expect(api.emit).not.toHaveBeenCalledWith(EVENTS.REQUEST);
  });

  it('should handle "running" status', () => {
    // given
    const api = createApi();
    const wrapper = mount(<ThemedA11YPanel api={api} active />);

    // when
    api.emit(EVENTS.MANUAL, false);
    wrapper.update();

    // then
    expect(wrapper.text()).toMatch(/Please wait while the accessibility scan is running/);
    expect(api.emit).toHaveBeenCalledWith(EVENTS.REQUEST);
  });

  it('should handle "ran" status', () => {
    // given
    const api = createApi();
    const wrapper = mount(<ThemedA11YPanel api={api} active />);

    // when
    api.emit(EVENTS.RESULT, axeResult);
    wrapper.update();

    // then
    expect(
      wrapper
        .find('button')
        .last()
        .text()
        .trim()
    ).toBe('Tests completed');
    expect(wrapper.find('Tabs').prop('tabs').length).toBe(3);
    expect(wrapper.find('Tabs').prop('tabs')[0].label.props.children).toEqual([1, ' Violations']);
    expect(wrapper.find('Tabs').prop('tabs')[1].label.props.children).toEqual([1, ' Passes']);
    expect(wrapper.find('Tabs').prop('tabs')[2].label.props.children).toEqual([1, ' Incomplete']);
  });

  it('should handle inactive state', () => {
    // given
    const api = createApi();

    // when
    const wrapper = mount(<ThemedA11YPanel api={api} active={false} />);

    // then
    expect(wrapper.text()).toBe('');
    expect(api.emit).not.toHaveBeenCalled();
  });
});
