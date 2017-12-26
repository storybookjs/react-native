function getMeta(component: any, [name1, name2]: any, defaultValue: any) {
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

  return (<any>window)['Reflect'].getMetadata(name2, component) || defaultValue;
}

export function getAnnotations(component: any) {
  return getMeta(component, ['annotations'], []);
}

export function getPropMetadata(component: any) {
  return getMeta(component, ['__prop__metadata__', 'propMetadata'], {});
}

export function getParameters(component: any) {
  return getMeta(component, ['parameters'], []);
}