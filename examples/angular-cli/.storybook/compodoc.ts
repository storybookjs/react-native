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

const hasDecorator = (item: any, decoratorName: string) =>
  item.decorators && item.decorators.find(x => x.name === decoratorName);

const mapItemToSection = (key: string, item: any): string => {
  switch (key) {
    case 'methodsClass':
      return 'methods';
    case 'inputsClass':
      return 'inputs';
    case 'outputsClass':
      return 'outputs';
    case 'propertiesClass':
      if (hasDecorator(item, 'ViewChild')) {
        return 'view child';
      }
      if (hasDecorator(item, 'ViewChildren')) {
        return 'view children';
      }
      if (hasDecorator(item, 'ContentChild')) {
        return 'content child';
      }
      if (hasDecorator(item, 'ContentChildren')) {
        return 'content children';
      }
      return 'properties';
    default:
      throw new Error(`Unknown key: ${key}`);
  }
};

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

const displaySignature = (item: any): string => {
  const args = item.args.map(arg => `${arg.name}${arg.optional ? '?' : ''}: ${arg.type}`);
  return `(${args.join(', ')}) => ${item.returnType}`;
};

export const extractProps = (component: any) => {
  const componentData = getComponentData(component);
  if (!componentData) {
    return null;
  }

  const sectionToItems = {};

  const COMPODOC_CLASSES = ['propertiesClass', 'methodsClass', 'inputsClass', 'outputsClass'];
  COMPODOC_CLASSES.forEach(key => {
    const data = componentData[key];
    if (data && data.length) {
      data.forEach(item => {
        const section = mapItemToSection(key, item);
        if (!sectionToItems[section]) {
          sectionToItems[section] = [];
        }
        let typeName = item.type;
        let required = !item.optional;
        if (key === 'methodsClass') {
          typeName = displaySignature(item);
          required = false;
        }
        sectionToItems[section].push({
          name: item.name,
          type: { name: typeName },
          required,
          description: item.description,
          defaultValue: item.defaultValue,
        });
      });
    }
  });

  // sort the sections
  const SECTIONS = [
    'inputs',
    'outputs',
    'properties',
    'methods',
    'view child',
    'view children',
    'content child',
    'content children',
  ];
  const sections = {};
  SECTIONS.forEach(section => {
    const items = sectionToItems[section];
    if (items) {
      sections[section] = items;
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
