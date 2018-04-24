import { document, Node } from 'global';

const style = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'auto',
};

const innerStyle = {
  margin: 'auto',
};

export default function(storyFn) {
  const inner = document.createElement('div');
  Object.assign(inner.style, innerStyle);

  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, style);
  wrapper.appendChild(inner);

  const component = storyFn();

  if (typeof component === 'string') {
    inner.innerHTML = component;
  } else if (component instanceof Node) {
    inner.appendChild(component);
  } else {
    return component;
  }

  return wrapper;
}
