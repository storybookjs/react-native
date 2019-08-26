import { document } from 'global';
import { makeDecorator } from '@storybook/addons';
import parameters from './parameters';
import styles from './styles';

function centered(storyFn: () => { template: any; context: any }) {
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

export default makeDecorator({
  ...parameters,
  wrapper: getStory => centered(getStory as any),
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
