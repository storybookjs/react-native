import { PropDef } from '@storybook/components';
import { isNil } from 'lodash';
import { Component } from '../../../blocks/shared';

// react-docgen doesn't returned the props in the order they were defined in the "propTypes" object of the component.
// This function re-order them by their original definition order.
export function keepOriginalDefinitionOrder(
  extractedProps: PropDef[],
  component: Component
): PropDef[] {
  // eslint-disable-next-line react/forbid-foreign-prop-types
  const { propTypes } = component;

  if (!isNil(propTypes)) {
    return Object.keys(propTypes)
      .map(x => extractedProps.find(y => y.name === x))
      .filter(x => x);
  }

  return extractedProps;
}
