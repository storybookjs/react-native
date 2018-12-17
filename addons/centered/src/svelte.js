import Centered from './components/Centered.svelte';
import styles from './styles';
import json2CSS from './helpers/json2CSS';

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
export default function(storyFn) {
  const { Component: OriginalComponent, data, on } = storyFn();

  return { Component: OriginalComponent, data, on, Wrapper: Centered, WrapperData: centeredStyles };
}

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
