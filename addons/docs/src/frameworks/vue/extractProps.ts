import { PropDef } from '@storybook/components';
import { PropsExtractor, extractPropsFromDocgen, hasDocgen } from '../../lib/docgenUtils';

const SECTIONS = ['props', 'events', 'slots'];

export const extractProps: PropsExtractor = component => {
  if (!hasDocgen(component)) {
    return null;
  }
  const sections: Record<string, PropDef[]> = {};
  SECTIONS.forEach(section => {
    sections[section] = extractPropsFromDocgen(component, section);
  });
  return { sections };
};
