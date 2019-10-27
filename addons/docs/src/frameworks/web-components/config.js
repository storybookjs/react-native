/* global window */
/* eslint-disable import/no-extraneous-dependencies */
import { addParameters } from '@storybook/web-components';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';

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

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
    extractProps: tagName => {
      // eslint-disable-next-line no-underscore-dangle
      const customElements = window.__STORYBOOK_CUSTOM_ELEMENTS__;
      if (customElements) {
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
  },
});
