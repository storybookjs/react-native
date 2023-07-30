import { parameters } from '@storybook/react/dist/config';
import { addArgTypesEnhancer, addParameters } from '@storybook/react-native';
import { enhanceArgTypes } from '@storybook/docs-tools';

addArgTypesEnhancer(enhanceArgTypes);
addParameters({
  docs: {
    extractArgTypes: (parameters as any)?.docs?.extractArgTypes,
  },
});
