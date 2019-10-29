/* eslint-disable no-underscore-dangle */
/* global window */

export const setCompodocJson = (compodocJson: any) => {
  // @ts-ignore
  window.__STORYBOOK_COMPODOC_JSON__ = compodocJson;
};

// @ts-ignore
export const getCompdocJson = () => window.__STORYBOOK_COMPODOC_JSON__;

export const checkValidComponent = component => {
  if (!component.name) {
    throw new Error(`Invalid component ${JSON.stringify(component)}`);
  }
};

export const checkValidCompodocJson = compodocJson => {
  if (!compodocJson || !compodocJson.components) {
    throw new Error('Invalid compodoc JSON');
  }
};

function isEmpty(obj) {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
}

const SECTIONS = [
  { label: 'properties', key: 'propertiesClass' },
  { label: 'methods', key: 'methodsClass' },
  { label: 'inputs', key: 'inputsClass' },
  { label: 'outputs', key: 'outputsClass' },
];

const getComponentData = (component: any) => {
  if (!component) {
    return null;
  }
  checkValidComponent(component);
  const compodocJson = getCompdocJson();
  checkValidCompodocJson(compodocJson);
  const { name } = component;
  return compodocJson.components.find(c => c.name === name);
};

export const extractProps = (component: any) => {
  const componentData = getComponentData(component);
  if (!componentData) {
    return null;
  }

  const sections = {};
  SECTIONS.forEach(({ label, key }) => {
    const data = componentData[key];
    if (data && data.length) {
      sections[label] = data.map(item => ({
        name: item.name,
        type: { name: item.type },
        required: !!item.optional,
        description: item.description,
        defaultValue: item.defaultValue,
      }));
    }
  });

  return isEmpty(sections) ? null : { sections };
};

export const extractComponentDescription = (component: any) => {
  const componentData = getComponentData(component);
  if (!componentData) {
    return null;
  }
  return componentData.rawdescription;
};
