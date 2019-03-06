import { document } from 'global';
import { addons, makeDecorator } from '@storybook/addons';
import { EVENTS, PARAM_KEY } from './constants';

const changeMediaAttribute = (element: HTMLElement, enabled: boolean) => {
  const current = element.getAttribute('media');
  if ((enabled && !current) || (!enabled && current === 'max-width: 1px')) {
    // don't do anything
  } else if (enabled && current === 'max-width: 1px') {
    // remove the attribute
    element.removeAttribute('media');
  } else if (enabled) {
    // add the disable attribute
    const value = current.replace(' and max-width: 1px', '');
    element.setAttribute('media', value);
  } else {
    // modify the existing attribute so it disables
    const value = current ? `${current} and max-width: 1px` : 'max-width: 1px';
    element.setAttribute('media', value);
  }
};

const createElement = (id: string, code: string): HTMLDivElement => {
  const element: HTMLDivElement = document.createElement('div');
  element.setAttribute('id', `storybook-addon-resource_${id}`);
  element.innerHTML = code;
  return element;
};

const getElement = (id: string, code: string) => {
  const found: Element = document.querySelector(`[id="storybook-addon-resource_${id}"]`);
  return { element: found || createElement(id, code), created: !found };
};

const updateElement = (id: string, code: string, value: boolean) => {
  const { element, created } = getElement(id, code);

  element.querySelectorAll('link').forEach(child => changeMediaAttribute(child, value));
  element.querySelectorAll('style').forEach(child => changeMediaAttribute(child, value));

  if (created) {
    document.body.appendChild(element);
  }
};

const list: any[] = [];

const setResources = (resources: Array<{ code: string; id: string }>) => {
  const added = resources.filter(i => !list.find(r => r.code === i.code));
  const removed = list.filter(i => !resources.find(r => r.code === i.code));

  added.forEach(r => list.push(r));

  resources.forEach(r => {
    const { id, code } = r;
    updateElement(id, code, true);
  });
  removed.forEach(r => {
    const { id, code } = r;
    updateElement(id, code, false);
  });
};

export const withCssResources = makeDecorator({
  name: 'withCssResources',
  parameterName: PARAM_KEY,
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: false,

  wrapper: (getStory, context, { options, parameters }) => {
    const storyOptions = parameters || options;
    addons.getChannel().on(EVENTS.SET, setResources);

    if (!Array.isArray(storyOptions) && !Array.isArray(storyOptions.cssresources)) {
      throw new Error('The `cssresources` parameter needs to be an Array');
    }

    return getStory(context);
  },
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
