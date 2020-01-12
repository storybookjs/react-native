// This example exists solely to demonstrate nav hierarchy
// in --docs mode when a folder contains both a component and
// individual stories
//
// See also ./mixed-leaves-folder.stories.js

export default {
  title: 'Addons/Docs/Mixed Leaves/Component',
  parameters: { chromatic: { disable: true } },
};

export const B = () => 'b';
export const C = () => 'c';
