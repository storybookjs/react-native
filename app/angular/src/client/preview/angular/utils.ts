function getMeta(component, [name1, name2]: any, defaultValue) {
  if (!name2) {
    name2 = name1;
    name1 = `__${name1}__`;
  }

  if (component[name1]) {
    return component[name1];
  }

  if (component[name2]) {
    return component[name2];
  }

  return window['Reflect'].getMetadata(name2, component) || defaultValue;
}

export function getAnnotations(component) {
  return getMeta(component, ['annotations'], []);
}

export function getPropMetadata(component) {
  return getMeta(component, ['__prop__metadata__', 'propMetadata'], {});
}

export function getParameters(component) {
  return getMeta(component, ['parameters'], []);
}