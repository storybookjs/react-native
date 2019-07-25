import React from 'react';
export default {};

export const functionStory = () => {
  const btn = document.createElement('button');
  btn.innerHTML = 'Hello Button';
  btn.addEventListener('click', action('Click'));
  return btn;
};

functionStory.story = {
  name: 'function',
  height: '100px',
};
