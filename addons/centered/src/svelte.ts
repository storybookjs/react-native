import { makeDecorator } from '@storybook/addons';
import Centered from './components/Centered.svelte';
import styles from './styles';
import json2CSS from './helpers/json2CSS';
import parameters from './parameters';

const centeredStyles = {
  /** @type {string} */
  style: json2CSS(styles.style),
  /** @type {string} */
  innerStyle: json2CSS(styles.innerStyle),
};

/**
 * This functionality works by passing the svelte story component into another
 * svelte component that has the single purpose of centering the story component
 * using a wrapper and container.
 *
 * We use the special element <svelte:component /> to achieve this.
 *
 * @see https://svelte.technology/guide#svelte-component
 */
function centered(storyFn: () => any) {
  const { Component: OriginalComponent, props, on } = storyFn();

  return {
    Component: OriginalComponent,
    props,
    on,
    Wrapper: Centered,
    WrapperData: centeredStyles,
  };
}

export default makeDecorator({
  ...parameters,
  wrapper: getStory => centered(getStory as any),
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
