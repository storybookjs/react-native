import Centered from './components/Centered.svelte';

export default function(storyFn) {
  const { Component, data } = storyFn();

  data.Story = Component;

  return { Component: Centered, data };
}
