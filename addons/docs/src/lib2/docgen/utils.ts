/* eslint-disable no-underscore-dangle */

import { isNil } from 'lodash';
import { Component } from '../../blocks/shared';

export const str = (obj: any) => {
  if (!obj) {
    return '';
  }
  if (typeof obj === 'string') {
    return obj as string;
  }
  throw new Error(`Description: expected string, got: ${JSON.stringify(obj)}`);
};

export function hasDocgen(component: Component): boolean {
  return !!component.__docgenInfo;
}

export function isValidDocgenSection(docgenSection: any) {
  return !isNil(docgenSection) && Object.keys(docgenSection).length > 0;
}

export function getDocgenSection(component: Component, section: string): any {
  return hasDocgen(component) ? component.__docgenInfo[section] : null;
}

export const extractComponentDescription = (component?: Component) =>
  component && hasDocgen(component) && str(component.__docgenInfo.description);
