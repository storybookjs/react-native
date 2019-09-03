import { document, Node } from 'global';
import { makeDecorator } from '@storybook/addons';
import parameters from './parameters';
import styles from './styles';

const INNER_ID = 'sb-addon-centered-inner';
const WRAPPER_ID = 'sb-addon-centered-wrapper';

function getOrCreate(id: string, style: Partial<CSSStyleDeclaration>): HTMLDivElement {
  const elementOnDom = document.getElementById(id);

  if (elementOnDom) {
    return elementOnDom;
  }

  const element = document.createElement('div') as HTMLDivElement;
  element.setAttribute('id', id);
  Object.assign(element.style, style);

  return element;
}

function getInnerDiv() {
  return getOrCreate(INNER_ID, styles.innerStyle);
}

function getWrapperDiv() {
  return getOrCreate(WRAPPER_ID, styles.style);
}

function centered(storyFn: () => any) {
  const inner = getInnerDiv();
  const wrapper = getWrapperDiv();
  wrapper.appendChild(inner);

  const element = storyFn();

  if (typeof element === 'string') {
    inner.innerHTML = element;
  } else if (element instanceof Node) {
    inner.innerHTML = '';
    inner.appendChild(element);
  } else {
    return element;
  }

  return wrapper;
}

export default makeDecorator({
  ...parameters,
  wrapper: getStory => centered(getStory as any),
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
