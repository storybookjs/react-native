import { document } from 'global';
import styles from './styles';

export default function(storyFn: () => { template: any; context: any }) {
  const { template, context } = storyFn();

  const element = document.createElement('div');
  Object.assign(element.style, styles.style);

  const innerElement = document.createElement('div');
  Object.assign(innerElement.style, styles.innerStyle);

  element.appendChild(innerElement);

  // the inner element should append the parent
  innerElement.appendTo = function appendTo(el: any) {
    el.appendChild(element);
  };

  return {
    template,
    context,
    element: innerElement,
  };
}

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
