/* global window */
/* eslint-disable import/no-extraneous-dependencies */
import { addParameters } from '@storybook/client-api';
import { getCustomElements, isValidComponent, isValidMetaData } from '@storybook/web-components';
import React from 'react';
import { render } from 'lit-html';

function mapData(data) {
  return data.map(item => ({
    name: item.name,
    type: { summary: item.type },
    required: '',
    description: item.description,
    defaultValue: { summary: item.defaultValue },
  }));
}

function isEmpty(obj) {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
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
        if (metaData.attributes) {
          sections.attributes = mapData(metaData.attributes);
        }
        if (metaData.properties) {
          sections.properties = mapData(metaData.properties);
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
    inlineStories: true,
    prepareForInline: storyFn => {
      class Story extends React.Component {
        constructor(props) {
          super(props);
          this.wrapperRef = React.createRef();
        }

        componentDidMount() {
          render(storyFn(), this.wrapperRef.current);
        }

        render() {
          return React.createElement('div', { ref: this.wrapperRef });
        }
      }

      return React.createElement(Story);
    },
  },
});
