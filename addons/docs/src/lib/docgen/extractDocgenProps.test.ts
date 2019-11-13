/* eslint-disable no-underscore-dangle */

import { Component } from '../../blocks/shared';
import { extractPropsFromDocgen } from './extractDocgenProps';

const DOCGEN_SECTION = 'props';
const PROP_NAME = 'propName';

interface TypeSystemDef {
  name: string;
  typeProperty?: string;
}

const TypeSystems: TypeSystemDef[] = [
  { name: 'javascript', typeProperty: 'type' },
  { name: 'typescript', typeProperty: 'tsType' },
];

function createType(typeName: string, others: Record<string, any> = {}): Record<string, string> {
  return {
    name: typeName,
    ...others,
  };
}

function createStringType(typeSystemDef: TypeSystemDef, others: Record<string, any> = {}): any {
  return {
    [typeSystemDef.typeProperty]: createType('string', others),
  };
}

function createFuncType(typeSystemDef: TypeSystemDef, others: Record<string, any> = {}): any {
  const typeName = typeSystemDef.name === 'javascript' ? 'func' : '() => {}';

  return {
    [typeSystemDef.typeProperty]: createType(typeName, others),
  };
}

function createComponent(docgenInfo: Record<string, any>): Component {
  const component = () => {};
  // @ts-ignore
  component.__docgenInfo = {
    [DOCGEN_SECTION]: {
      [PROP_NAME]: {
        required: false,
        ...docgenInfo,
      },
    },
  };

  return component;
}

TypeSystems.forEach(x => {
  it('should map defaults docgen info properly', () => {
    const component = createComponent({
      ...createStringType(x),
      description: 'Hey! Hey!',
      defaultValue: {
        value: 'Default',
      },
    });

    const { propDef } = extractPropsFromDocgen(component, DOCGEN_SECTION)[0];

    expect(propDef.name).toBe(PROP_NAME);
    expect(propDef.type.summary).toBe('string');
    expect(propDef.description).toBe('Hey! Hey!');
    expect(propDef.required).toBe(false);
    expect(propDef.defaultValue.summary).toBe('Default');
  });

  it('should remove JSDoc tags from the description', () => {
    const component = createComponent({
      ...createStringType(x),
      description: 'Hey!\n@param event\nreturns {string}',
    });

    const { propDef } = extractPropsFromDocgen(component, DOCGEN_SECTION)[0];

    expect(propDef.description).toBe('Hey!');
  });

  it('should not remove newline characters of multilines description without JSDoc tags', () => {
    const component = createComponent({
      ...createStringType(x),
      description: 'onClick description\nis a\nmulti-lines\ndescription',
    });

    const { propDef } = extractPropsFromDocgen(component, DOCGEN_SECTION)[0];

    expect(propDef.description).toBe('onClick description\nis a\nmulti-lines\ndescription');
  });

  it('should not remove newline characters of multilines description with JSDoc tags', () => {
    const component = createComponent({
      ...createFuncType(x),
      description: 'onClick description\nis a\nmulti-lines\ndescription\n@param event',
    });

    const { propDef } = extractPropsFromDocgen(component, DOCGEN_SECTION)[0];

    expect(propDef.description).toBe('onClick description\nis a\nmulti-lines\ndescription');
  });

  it('should not remove markdown from description without JSDoc tags', () => {
    const component = createComponent({
      ...createStringType(x),
      description: 'onClick *emphasis*, **strong**, `formatted` description.',
    });

    const { propDef } = extractPropsFromDocgen(component, DOCGEN_SECTION)[0];

    expect(propDef.description).toBe('onClick *emphasis*, **strong**, `formatted` description.');
  });

  it('should not remove markdown from description with JSDoc tags', () => {
    const component = createComponent({
      ...createFuncType(x),
      description: 'onClick *emphasis*, **strong**, `formatted` description.\n@param event',
    });

    const { propDef } = extractPropsFromDocgen(component, DOCGEN_SECTION)[0];

    expect(propDef.description).toBe('onClick *emphasis*, **strong**, `formatted` description.');
  });

  it('should return null when the property is marked with @ignore', () => {
    const component = createComponent({
      ...createStringType(x),
      description: 'onClick description\n@ignore',
    });

    expect(extractPropsFromDocgen(component, DOCGEN_SECTION).length).toBe(0);
  });

  it('should provide raw @param tags', () => {
    const component = createComponent({
      ...createFuncType(x),
      description:
        'onClick description\n@param {SyntheticEvent} event - Original event.\n@param {string} value',
    });

    const { propDef } = extractPropsFromDocgen(component, DOCGEN_SECTION)[0];

    expect(propDef.description).toBe('onClick description');
    expect(propDef.jsDocTags).toBeDefined();
    expect(propDef.jsDocTags.params).toBeDefined();
    expect(propDef.jsDocTags.params[0].name).toBe('event');
    expect(propDef.jsDocTags.params[0].description).toBe('Original event.');
    expect(propDef.jsDocTags.params[1].name).toBe('value');
    expect(propDef.jsDocTags.params[1].description).toBeNull();
  });
});
