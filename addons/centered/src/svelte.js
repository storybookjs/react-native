import Centered from './components/Centered.svelte';
import styles from './styles';
import json2CSS from './helpers/json2CSS';

const stylesCss = {
  style: json2CSS(styles.style),
  inner: json2CSS(styles.innerStyle),
};

export default function(storyFn) {
  const { Component, data } = storyFn();

  const centeredData = {
    Story: Component,
    styles: stylesCss,
    storyData: data,
  };

  return { Component: Centered, data: centeredData };
}
