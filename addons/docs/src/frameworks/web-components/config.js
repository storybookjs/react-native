/* global window */
/* eslint-disable import/no-extraneous-dependencies */
import { addParameters } from '@storybook/client-api';
import { getCustomElements } from './customElements';

function mapData(data) {
  return data.map(item => ({
    name: item.name,
    type: { name: item.type },
    required: '',
    description: item.description,
    defaultValue: item.default,
  }));
}

function isEmpty(obj) {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
}

function isValidComponent(tagName) {
  if (!tagName) {
    return false;
  }
  if (typeof tagName === 'string') {
    return true;
  }
  throw new Error('Provided component needs to be a string. e.g. component: "my-element"');
}

function isValidMetaData(customElements) {
  if (!customElements) {
    return false;
  }
  if (customElements.tags && Array.isArray(customElements.tags)) {
    return true;
  }
  throw new Error(`You need to setup valid meta data in your config.js via setCustomElements().
    See the readme of addon-docs for web components for more details.`);
}

addParameters({
  docs: {
    extractProps: tagName => {
      const customElements = getCustomElements();
      if (isValidComponent(tagName) && isValidMetaData(customElements)) {
        const metaData = customElements.tags.find(
          tag => tag.name.toUpperCase() === tagName.toUpperCase()
        );
        const sections = {};
        if (metaData.properties) {
          sections.props = mapData(metaData.properties);
        }
        if (metaData.events) {
          sections.events = mapData(metaData.events);
        }
        if (metaData.slots) {
          sections.slots = mapData(metaData.slots);
        }
        if (metaData.cssProperties) {
          sections.css = mapData(metaData.cssProperties);
        }
        return isEmpty(sections) ? false : { sections };
      }
      return false;
    },
    extractComponentDescription: tagName => {
      const customElements = getCustomElements();
      if (isValidComponent(tagName) && isValidMetaData(customElements)) {
        const metaData = customElements.tags.find(
          tag => tag.name.toUpperCase() === tagName.toUpperCase()
        );
        if (metaData && metaData.description) {
          return metaData.description;
        }
      }
      return false;
    },
  },
});
