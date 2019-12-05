/* eslint-disable no-underscore-dangle */
/* global window */

export const setJSONDoc = jsondoc => {
  window.__EMBER_GENERATED_DOC_JSON__ = jsondoc;
};
export const getJSONDoc = () => {
  return window.__EMBER_GENERATED_DOC_JSON__;
};

export const extractProps = componentName => {
  const json = getJSONDoc();
  const componentDoc = json.included.find(doc => doc.attributes.name === componentName);
  const rows = componentDoc.attributes.arguments.map(prop => {
    return {
      name: prop.name,
      type: prop.type,
      required: prop.tags.length ? prop.tags.some(tag => tag.name === 'required') : false,
      defaultValue: prop.defaultValue,
      description: prop.description,
    };
  });
  return { rows };
};

export const extractComponentDescription = componentName => {
  const json = getJSONDoc();
  const componentDoc = json.included.find(doc => doc.attributes.name === componentName);
  return componentDoc.attributes.description;
};
