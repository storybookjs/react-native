import { propTypesHandler, tsHandler, flowHandler, unknownHandler } from './type-system-handlers';
import { DocgenInfo } from './DocgenInfo';

const DEFAULT_PROP_NAME = 'propName';

const PROP_TYPES_STRING_TYPE = {
  name: 'string',
};

const PROP_TYPES_FUNC_TYPE = {
  name: 'func',
};

const TS_FUNC_TYPE = {
  name: '() => void',
};

const TS_STRING_TYPE = {
  name: 'string',
};

function createDocgenInfo(overrides: Record<string, any> = {}): DocgenInfo {
  return {
    type: null,
    required: true,
    description: 'A string prop',
    defaultValue: {
      value: 'default string',
    },
    ...overrides,
  };
}

describe('prop-types handler', () => {
  it('should map defaults docgen info properly', () => {
    const docgenInfo = createDocgenInfo({
      type: PROP_TYPES_STRING_TYPE,
    });

    const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(propDef.name).toBe(DEFAULT_PROP_NAME);
    expect(propDef.type.name).toBe(docgenInfo.type.name);
    expect(propDef.description).toBe(docgenInfo.description);
    expect(propDef.required).toBe(docgenInfo.required);
    expect(propDef.defaultValue).toBe(docgenInfo.defaultValue.value);
  });

  describe('for all prop types', () => {
    it('should handle prop without a description', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_STRING_TYPE,
        description: undefined,
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBeUndefined();
    });

    it('should clean the description', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_STRING_TYPE,
        description: 'onClick description\n@param {SyntheticEvent} event',
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('onClick description');
    });

    it('should have an empty description when the description only contains JSDoc', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_STRING_TYPE,
        description: '@param event',
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('');
    });

    it('should not remove newline characters of multilines description without JSDoc tags', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_STRING_TYPE,
        description: 'onClick description\nis a\nmulti-lines\ndescription',
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('onClick description\nis a\nmulti-lines\ndescription');
    });

    it('should not remove newline characters of multilines description with JSDoc tags', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_STRING_TYPE,
        description: 'onClick description\nis a\nmulti-lines\ndescription\n@param event',
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('onClick description\nis a\nmulti-lines\ndescription');
    });

    it('should not remove markdown from description without JSDoc tags', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_STRING_TYPE,
        description: 'onClick *emphasis*, **strong**, `formatted` description.',
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('onClick *emphasis*, **strong**, `formatted` description.');
    });

    it('should not remove markdown from description with JSDoc tags', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_STRING_TYPE,
        description: 'onClick *emphasis*, **strong**, `formatted` description.\n@param event',
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('onClick *emphasis*, **strong**, `formatted` description.');
    });

    it('should not remove @ characters that does not match JSDoc tags', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_STRING_TYPE,
        description: 'onClick @description@',
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('onClick @description@');
    });

    it('should not set ignore to true when the property is not marked with @ignore', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_STRING_TYPE,
        description: 'onClick description',
      });

      const { ignore } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(ignore).toBeFalsy();
    });

    it('should set ignore to true when the property is marked with @ignore', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_STRING_TYPE,
        description: 'onClick description\n@ignore',
      });

      const { ignore } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(ignore).toBeTruthy();
    });
  });

  describe('when the prop is a function', () => {
    it("should have func as type when the props doesn't have a description", () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_FUNC_TYPE,
        description: undefined,
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBeUndefined();
      expect(propDef.type.name).toBe('func');
    });

    it('should have func as type when the prop have a description without JSDoc', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_FUNC_TYPE,
        description: 'onClick description',
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.type.name).toBe('func');
      expect(propDef.description).toBe('onClick description');
    });

    it('should have an empty description when the description only contains JSDoc', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_FUNC_TYPE,
        description: '@param event',
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('');
    });

    describe('when the description contains a @param tag', () => {
      it('should have func as type when it is an invalid @param tag', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a single arg as type when it is a @param tag with a name', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param event',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a single arg as type when it is a @param tag with a name and a type', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param {SyntheticEvent} event',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a single arg as type when it is a @param tag with a name, a type and a desc', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event - Original SyntheticEvent',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have func as type when it is @param tag without a name 1', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param - Original SyntheticEvent',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have func as type when it is @param tag without a name 2', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param {SyntheticEvent} - Original SyntheticEvent',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of record type with a single field', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param {{a: number}} event',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: ({a: number}))');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of record type with multiple fields', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param {{a: number, b: string}} event',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: ({a: number, b: string}))');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of record type with a field having only a name', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param {{a}} event',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: ({a}))');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of union type', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param {(number|boolean)} event',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: (number|boolean))');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of array type', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param {number[]} event',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: number[])');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of untyped array type', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param {[]} event',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: [])');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param with a nullable type', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param {?number} event',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: number)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param with a non nullable type', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param {!number} event',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: number)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support optional param 1', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param {number} [event]',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: number)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support optional param 2', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param {number=} event',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: number)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of type any', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param {*} event',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: any)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support multilines description when there is a @param', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\nis a\nmulti-lines\ndescription\n@param event',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event)');
        expect(propDef.description).toBe('onClick description\nis a\nmulti-lines\ndescription');
      });

      it('should support multilines @param description', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description:
            'onClick description\n@param event - This is my param\nmultiline description\n@param customData',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event, customData)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should autofix missing space between the param name and the description separator', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event- Original SyntheticEvent',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should autofix param name ending with . followed by a @returns tag', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param {SyntheticEvent} event.\n',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should provide raw @param tags', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event - Original event.\n@param {string} value',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.description).toBe('onClick description');
        expect(propDef.jsDocTags).toBeDefined();
        expect(propDef.jsDocTags.params).toBeDefined();
        expect(propDef.jsDocTags.params[0].name).toBe('event');
        expect(propDef.jsDocTags.params[0].description).toBe('Original event.');
        expect(propDef.jsDocTags.params[1].name).toBe('value');
        expect(propDef.jsDocTags.params[1].description).toBeNull();
      });
    });

    describe('when the description contains multiple @param tags', () => {
      it('should have a func signature with multiple args as type', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event\n@param {string} customData',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent, customData: string)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should ignore invalid @param tags', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event\n@param {string} customData\n@param {SyntheticEvent} - Original event',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent, customData: string)');
        expect(propDef.description).toBe('onClick description');
      });
    });

    it('should support @arg alias', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_FUNC_TYPE,
        description: 'onClick description\n@arg event',
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.type.name).toBe('(event)');
      expect(propDef.description).toBe('onClick description');
    });

    it('should support @argument alias', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_FUNC_TYPE,
        description: 'onClick description\n@argument event',
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.type.name).toBe('(event)');
      expect(propDef.description).toBe('onClick description');
    });

    describe('when the description contains a @returns tag', () => {
      it('should have func as type when it is an invalid @returns tag', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@returns',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a return type as type when it is a @returns tag with a type', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@returns {string}',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => string');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a return type as type when it is a @returns tag with a type and a description', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@returns {string} - A custom return type',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => string');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have func as type when it is a @returns tag without a type and there is no params.', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@returns - A custom return type',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have no return type when it is a @returns tag without a type and there is params.', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@param event\n@returns - A custom return type',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a full signature as type when there is a @param and a @returns tag 1', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event - Original event.\n@returns {string}',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent) => string');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a full signature as type when there is a @param and a @returns tag 2', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event - Original event.\n@param {string} customData\n@returns {string}',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent, customData: string) => string');
        expect(propDef.description).toBe('onClick description');
      });

      it('should only consider the last @returns tag when there is more than one', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@returns {string}\n@returns {integer}',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => integer');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of record type', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@returns {{a: number, b: string}}',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => ({a: number, b: string})');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of array type', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@returns {integer[]}',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => integer[]');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of union type', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@returns {(number|boolean)}',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => (number|boolean)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of type any', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@returns {*}',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => any');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of type void', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description: 'onClick description\n@returns {void}',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => void');
        expect(propDef.description).toBe('onClick description');
      });

      it('should provide raw @returns tags when a description is defined', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event - Original event.\n@returns {string} - An awesome string.',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.description).toBe('onClick description');
        expect(propDef.jsDocTags).toBeDefined();
        expect(propDef.jsDocTags.returns).toBeDefined();
        expect(propDef.jsDocTags.returns.description).toBe('An awesome string.');
      });

      it('should provide raw @returns tags when there is no description', () => {
        const docgenInfo = createDocgenInfo({
          type: PROP_TYPES_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event - Original event.\n@returns {string}',
        });

        const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.description).toBe('onClick description');
        expect(propDef.jsDocTags).toBeDefined();
        expect(propDef.jsDocTags.returns).toBeDefined();
        expect(propDef.jsDocTags.returns.description).toBeNull();
      });
    });

    it('should remove extra newline characters between tags', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_FUNC_TYPE,
        description:
          'onClick description\n@param {SyntheticEvent} event - Original event.\n     \n     \n     \n@returns {string}',
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.type.name).toBe('(event: SyntheticEvent) => string');
      expect(propDef.description).toBe('onClick description');
    });

    it('should ignore unsupported JSDoc tags', () => {
      const docgenInfo = createDocgenInfo({
        type: PROP_TYPES_FUNC_TYPE,
        description:
          'onClick description\n@param {SyntheticEvent} event\n@type {number}\n@returns {string}\n@version 2',
      });

      const { propDef } = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.type.name).toBe('(event: SyntheticEvent) => string');
      expect(propDef.description).toBe('onClick description');
    });
  });
});

describe('ts handler', () => {
  it('should map defaults docgen info properly', () => {
    const docgenInfo = createDocgenInfo({
      tsType: PROP_TYPES_STRING_TYPE,
    });

    const { propDef } = tsHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(propDef.name).toBe(DEFAULT_PROP_NAME);
    expect(propDef.type.name).toBe(docgenInfo.tsType.name);
    expect(propDef.description).toBe(docgenInfo.description);
    expect(propDef.required).toBe(docgenInfo.required);
    expect(propDef.defaultValue).toBe(docgenInfo.defaultValue.value);
  });

  it('should provide raw @param tags', () => {
    const docgenInfo = createDocgenInfo({
      tsType: TS_FUNC_TYPE,
      description:
        'onClick description\n@param {SyntheticEvent} event - Original event.\n@param {string} value',
    });

    const { propDef } = tsHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(propDef.description).toBe('onClick description');
    expect(propDef.jsDocTags).toBeDefined();
    expect(propDef.jsDocTags.params).toBeDefined();
    expect(propDef.jsDocTags.params[0].name).toBe('event');
    expect(propDef.jsDocTags.params[0].description).toBe('Original event.');
    expect(propDef.jsDocTags.params[1].name).toBe('value');
    expect(propDef.jsDocTags.params[1].description).toBeNull();
  });

  it('should provide raw @returns tags when a description is defined', () => {
    const docgenInfo = createDocgenInfo({
      tsType: TS_FUNC_TYPE,
      description:
        'onClick description\n@param {SyntheticEvent} event - Original event.\n@returns {string} - An awesome string.',
    });

    const { propDef } = tsHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(propDef.description).toBe('onClick description');
    expect(propDef.jsDocTags).toBeDefined();
    expect(propDef.jsDocTags.returns).toBeDefined();
    expect(propDef.jsDocTags.returns.description).toBe('An awesome string.');
  });

  it('should provide raw @returns tags when there is no description', () => {
    const docgenInfo = createDocgenInfo({
      tsType: TS_FUNC_TYPE,
      description:
        'onClick description\n@param {SyntheticEvent} event - Original event.\n@returns {string}',
    });

    const { propDef } = tsHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(propDef.description).toBe('onClick description');
    expect(propDef.jsDocTags).toBeDefined();
    expect(propDef.jsDocTags.returns).toBeDefined();
    expect(propDef.jsDocTags.returns.description).toBeNull();
  });

  it('should not set ignore to true when the property is not marked with @ignore', () => {
    const docgenInfo = createDocgenInfo({
      tsType: TS_STRING_TYPE,
      description: 'onClick description',
    });

    const { ignore } = tsHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(ignore).toBeFalsy();
  });

  it('should set ignore to true when the property is marked with @ignore', () => {
    const docgenInfo = createDocgenInfo({
      tsType: TS_STRING_TYPE,
      description: 'onClick description\n@ignore',
    });

    const { ignore } = tsHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(ignore).toBeTruthy();
  });
});

describe('flow handler', () => {
  it('should map defaults docgen info properly', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'string',
      },
    });

    const { propDef } = flowHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(propDef.name).toBe(DEFAULT_PROP_NAME);
    expect(propDef.type.name).toBe(docgenInfo.flowType.name);
    expect(propDef.description).toBe(docgenInfo.description);
    expect(propDef.required).toBe(docgenInfo.required);
    expect(propDef.defaultValue).toBe(docgenInfo.defaultValue.value);
  });

  it('should not set ignore to true when the property is not marked with @ignore', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'string',
      },
      description: 'onClick description',
    });

    const { ignore } = flowHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(ignore).toBeFalsy();
  });

  it('should set ignore to true when the property is marked with @ignore', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'string',
      },
      description: 'onClick description\n@ignore',
    });

    const { ignore } = flowHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(ignore).toBeTruthy();
  });
});

describe('unknown handler', () => {
  it('should map defaults docgen info properly', () => {
    const docgenInfo = createDocgenInfo();

    const { propDef } = unknownHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(propDef.name).toBe(DEFAULT_PROP_NAME);
    expect(propDef.type.name).toBe('unknown');
    expect(propDef.description).toBe(docgenInfo.description);
    expect(propDef.required).toBe(docgenInfo.required);
    expect(propDef.defaultValue).toBe(docgenInfo.defaultValue.value);
  });

  it('should not set ignore to true when the property is not marked with @ignore', () => {
    const docgenInfo = createDocgenInfo({
      description: 'onClick description',
    });

    const { ignore } = unknownHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(ignore).toBeFalsy();
  });

  it('should set ignore to true when the property is marked with @ignore', () => {
    const docgenInfo = createDocgenInfo({
      description: 'onClick description\n@ignore',
    });

    const { ignore } = unknownHandler(DEFAULT_PROP_NAME, docgenInfo);
    expect(ignore).toBeTruthy();
  });
});
