import React from 'react';
import { useEffect, useRef, useState } from '@storybook/client-api';

export default {
  title: 'Hooks',
};

export const Checkbox = () => {
  const [on, setOn] = useState(false);
  return (
    <label>
      <input type="checkbox" checked={on} onChange={e => setOn(e.target.checked)} />
      On
    </label>
  );
};

export const Input = () => {
  const [text, setText] = useState('foo');
  return <input value={text} onChange={e => setText(e.target.value)} />;
};

export const effect = () => {
  const ref = useRef();
  useEffect(() => {
    if (ref.current != null) {
      ref.current.style.backgroundColor = 'yellow';
    }
  });

  return (
    <button type="button" ref={ref}>
      I should be yellow
    </button>
  );
};

export const reactHookCheckbox = () => {
  const [on, setOn] = React.useState(false);
  return (
    <label>
      <input type="checkbox" checked={on} onChange={e => setOn(e.target.checked)} />
      On
    </label>
  );
};
