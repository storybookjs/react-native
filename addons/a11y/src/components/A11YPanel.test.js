import React from 'react';
import { mount } from 'enzyme';

import { ThemeProvider, themes, convert } from '@storybook/theming';
import { STORY_RENDERED } from '@storybook/core-events';
import { ScrollArea } from '@storybook/components';

import { A11YPanel } from './A11YPanel.tsx';
import { EVENTS } from '../constants';

function createApi() {
  return {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  };
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
  it('should register STORY_RENDERED and RESULT updater on mount', () => {
    // given
    const api = createApi();
    expect(api.on).not.toHaveBeenCalled();

    // when
    mount(<ThemedA11YPanel api={api} />);

    // then
    expect(api.on.mock.calls.length).toBe(2);
    expect(api.on.mock.calls[0][0]).toBe(STORY_RENDERED);
    expect(api.on.mock.calls[1][0]).toBe(EVENTS.RESULT);
  });

  it('should request a run on tab activation', () => {
    // given
    const api = createApi();

    const wrapper = mount(<ThemedA11YPanel api={api} />);
    expect(api.emit).not.toHaveBeenCalled();

    // when
    wrapper.setProps({ active: true });
    wrapper.update();

    // then
    expect(api.emit).toHaveBeenCalledWith(EVENTS.REQUEST);
    expect(wrapper.find(ScrollArea).length).toBe(0);
  });

  it('should deregister STORY_RENDERED and RESULT updater on unmount', () => {
    // given
    const api = createApi();
    const wrapper = mount(<ThemedA11YPanel api={api} />);
    expect(api.off).not.toHaveBeenCalled();

    // when
    wrapper.unmount();

    // then
    expect(api.off.mock.calls.length).toBe(2);
    expect(api.off.mock.calls[0][0]).toBe(STORY_RENDERED);
    expect(api.off.mock.calls[1][0]).toBe(EVENTS.RESULT);
  });

  it('should update run result', () => {
    // given
    const api = createApi();
    const wrapper = mount(<ThemedA11YPanel api={api} active />);
    const onUpdate = api.on.mock.calls.find(([event]) => event === EVENTS.RESULT)[1];

    expect(
      wrapper
        .find('button')
        .last()
        .text()
        .trim()
    ).toBe('Rerun tests');

    // when
    onUpdate(axeResult);

    // then
    expect(
      wrapper
        .find('button')
        .last()
        .text()
        .trim()
    ).toBe('Tests completed');
  });

  it('should request run', () => {
    // given
    const api = createApi();
    const wrapper = mount(<ThemedA11YPanel api={api} active />);
    const request = api.on.mock.calls.find(([event]) => event === STORY_RENDERED)[1];

    expect(
      wrapper
        .find('button')
        .last()
        .text()
        .trim()
    ).toBe('Rerun tests');
    expect(api.emit).not.toHaveBeenCalled();

    // when
    request();

    // then
    expect(
      wrapper
        .find('button')
        .last()
        .text()
        .trim()
    ).toBe('Running test');
    expect(api.emit).toHaveBeenCalledWith(EVENTS.REQUEST);
  });

  it('should NOT request run on inactive tab', () => {
    // given
    const api = createApi();
    mount(<ThemedA11YPanel api={api} active={false} />);
    const request = api.on.mock.calls.find(([event]) => event === STORY_RENDERED)[1];
    expect(api.emit).not.toHaveBeenCalled();

    // when
    request();

    // then
    expect(api.emit).not.toHaveBeenCalled();
  });

  it('should render report', () => {
    // given
    const api = createApi();
    const wrapper = mount(<ThemedA11YPanel api={api} active />);
    const onUpdate = api.on.mock.calls.find(([event]) => event === EVENTS.RESULT)[1];

    // when
    onUpdate(axeResult);

    // then
    expect(wrapper.find(A11YPanel)).toMatchSnapshot();
  });

  it("should render loader when it's running", () => {
    // given
    const api = createApi();
    const wrapper = mount(<ThemedA11YPanel api={api} active />);
    const request = api.on.mock.calls.find(([event]) => event === STORY_RENDERED)[1];

    // when
    request();
    wrapper.update();

    // then
    expect(wrapper.find('ScrollArea').length).toBe(0);
    expect(wrapper.find('Loader').length).toBe(1);
    expect(wrapper.find('ActionBar').length).toBe(1);
    expect(wrapper.find('Loader')).toMatchSnapshot();
  });

  it('should NOT anything when tab is not active', () => {
    // given
    const api = createApi();

    // when
    const wrapper = mount(<ThemedA11YPanel api={api} active={false} />);

    // then
    expect(wrapper.find('ScrollArea').length).toBe(0);
    expect(wrapper.find('ActionBar').length).toBe(0);
  });
});
