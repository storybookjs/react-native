import { propTypesHandler, tsHandler, flowHandler, DocgenInfo } from './type-system-handlers';

const DEFAULT_PROP_NAME = 'propName';

const PROP_TYPE_FUNC_TYPE = {
  name: 'func',
};

function createPropTypesDocgenInfo(overrides: Record<string, any> = {}): DocgenInfo {
  return {
    type: { name: 'string' },
    required: true,
    description: 'A string prop',
    defaultValue: {
      value: 'default string',
    },
    ...overrides,
  };
}

function createTypeScriptDocgenInfo(overrides: Record<string, any> = {}): DocgenInfo {
  return {
    tsType: { name: 'string' },
    required: true,
    description: 'A string prop',
    defaultValue: {
      value: 'default string',
    },
    ...overrides,
  };
}

function createFlowDocgenInfo(overrides: Record<string, any> = {}): DocgenInfo {
  return {
    flowType: { name: 'string' },
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
    const docgenInfo = createPropTypesDocgenInfo();
    const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(propDef.name).toBe(DEFAULT_PROP_NAME);
    expect(propDef.type.name).toBe(docgenInfo.type.name);
    expect(propDef.description).toBe(docgenInfo.description);
    expect(propDef.required).toBe(docgenInfo.required);
    expect(propDef.defaultValue).toBe(docgenInfo.defaultValue.value);
  });

  describe('when the prop is not a function', () => {
    it('should handle prop without a description', () => {
      const docgenInfo = createPropTypesDocgenInfo({
        description: undefined,
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBeUndefined();
    });

    it('should clean the description', () => {
      const docgenInfo = createPropTypesDocgenInfo({
        type: {
          name: 'string',
        },
        description: 'onClick description\n@param {SyntheticEvent} event',
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('onClick description');
    });

    it('should have an empty description when the description only contains JSDoc', () => {
      const docgenInfo = createPropTypesDocgenInfo({
        type: {
          name: 'string',
        },
        description: '@param event',
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('');
    });

    it('should not remove newline characters of multilines description without JSDoc tags', () => {
      const docgenInfo = createPropTypesDocgenInfo({
        type: {
          name: 'string',
        },
        description: 'onClick description\nis a\nmulti-lines\ndescription',
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('onClick description\nis a\nmulti-lines\ndescription');
    });

    it('should not remove newline characters of multilines description with JSDoc tags', () => {
      const docgenInfo = createPropTypesDocgenInfo({
        type: {
          name: 'string',
        },
        description: 'onClick description\nis a\nmulti-lines\ndescription\n@param event',
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('onClick description\nis a\nmulti-lines\ndescription');
    });

    it('should not remove markdown from description without JSDoc tags', () => {
      const docgenInfo = createPropTypesDocgenInfo({
        type: {
          name: 'string',
        },
        description: 'onClick *emphasis*, **strong**, `formatted` description.',
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('onClick *emphasis*, **strong**, `formatted` description.');
    });

    it('should not remove markdown from description with JSDoc tags', () => {
      const docgenInfo = createPropTypesDocgenInfo({
        type: {
          name: 'string',
        },
        description: 'onClick *emphasis*, **strong**, `formatted` description.\n@param event',
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('onClick *emphasis*, **strong**, `formatted` description.');
    });

    it('should not remove @ characters that does not match JSDoc tags', () => {
      const docgenInfo = createPropTypesDocgenInfo({
        type: {
          name: 'string',
        },
        description: 'onClick @description@',
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('onClick @description@');
    });
  });

  describe('when the prop is a function', () => {
    it("should have func as type when the props doesn't have a description", () => {
      const docgenInfo = createPropTypesDocgenInfo({
        type: PROP_TYPE_FUNC_TYPE,
        description: undefined,
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBeUndefined();
      expect(propDef.type.name).toBe('func');
    });

    it('should have func as type when the prop have a description without JSDoc', () => {
      const docgenInfo = createPropTypesDocgenInfo({
        type: PROP_TYPE_FUNC_TYPE,
        description: 'onClick description',
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.type.name).toBe('func');
      expect(propDef.description).toBe('onClick description');
    });

    it('should have an empty description when the description only contains JSDoc', () => {
      const docgenInfo = createPropTypesDocgenInfo({
        type: PROP_TYPE_FUNC_TYPE,
        description: '@param event',
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.description).toBe('');
    });

    describe('when the description contains a @param tag', () => {
      it('should have func as type when it is an invalid @param tag', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a single arg as type when it is a @param tag with a name', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param event',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a single arg as type when it is a @param tag with a name and a type', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param {SyntheticEvent} event',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a single arg as type when it is a @param tag with a name, a type and a desc', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event - Original SyntheticEvent',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have func as type when it is @param tag without a name 1', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param - Original SyntheticEvent',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have func as type when it is @param tag without a name 2', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param {SyntheticEvent} - Original SyntheticEvent',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of record type with a single field', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param {{a: number}} event',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: ({a: number}))');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of record type with multiple fields', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param {{a: number, b: string}} event',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: ({a: number, b: string}))');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of record type with a field having only a name', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param {{a}} event',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: ({a}))');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of union type', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param {(number|boolean)} event',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: (number|boolean))');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of array type', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param {number[]} event',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: number[])');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of untyped array type', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param {[]} event',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: [])');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param with a nullable type', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param {?number} event',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: number)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param with a non nullable type', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param {!number} event',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: number)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support optional param 1', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param {number} [event]',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: number)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support optional param 2', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param {number=} event',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: number)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support param of type any', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param {*} event',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: any)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support multilines description when there is a @param', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\nis a\nmulti-lines\ndescription\n@param event',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event)');
        expect(propDef.description).toBe('onClick description\nis a\nmulti-lines\ndescription');
      });

      it('should support multilines @param description', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description:
            'onClick description\n@param event - This is my param\nmultiline description\n@param customData',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event, customData)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should autofix missing space between the param name and the description separator', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event- Original SyntheticEvent',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should autofix param name ending with . followed by a @returns tag', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param {SyntheticEvent} event.\n',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent)');
        expect(propDef.description).toBe('onClick description');
      });
    });

    describe('when the description contains multiple @param tags', () => {
      it('should have a func signature with multiple args as type', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event\n@param {string} customData',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent, customData: string)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should ignore invalid @param tags', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event\n@param {string} customData\n@param {SyntheticEvent} - Original event',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent, customData: string)');
        expect(propDef.description).toBe('onClick description');
      });
    });

    it('should support @arg alias', () => {
      const docgenInfo = createPropTypesDocgenInfo({
        type: PROP_TYPE_FUNC_TYPE,
        description: 'onClick description\n@arg event',
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.type.name).toBe('(event)');
      expect(propDef.description).toBe('onClick description');
    });

    it('should support @argument alias', () => {
      const docgenInfo = createPropTypesDocgenInfo({
        type: PROP_TYPE_FUNC_TYPE,
        description: 'onClick description\n@argument event',
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.type.name).toBe('(event)');
      expect(propDef.description).toBe('onClick description');
    });

    describe('when the description contains a @returns tag', () => {
      it('should have func as type when it is an invalid @returns tag', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@returns',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a return type as type when it is a @returns tag with a type', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@returns {string}',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => string');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a func signature with a return type as type when it is a @returns tag with a type and a description', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@returns {string} - A custom return type',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => string');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have func as type when it is a @returns tag without a type and there is no params.', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@returns - A custom return type',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('func');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have no return type when it is a @returns tag without a type and there is params.', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@param event\n@returns - A custom return type',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a full signature as type when there is a @param and a @returns tag 1', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event - Original event.\n@returns {string}',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent) => string');
        expect(propDef.description).toBe('onClick description');
      });

      it('should have a full signature as type when there is a @param and a @returns tag 2', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description:
            'onClick description\n@param {SyntheticEvent} event - Original event.\n@param {string} customData\n@returns {string}',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('(event: SyntheticEvent, customData: string) => string');
        expect(propDef.description).toBe('onClick description');
      });

      it('should only consider the last @returns tag when there is more than one', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@returns {string}\n@returns {integer}',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => integer');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of record type', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@returns {{a: number, b: string}}',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => ({a: number, b: string})');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of array type', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@returns {integer[]}',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => integer[]');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of union type', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@returns {(number|boolean)}',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => (number|boolean)');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of type any', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@returns {*}',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => any');
        expect(propDef.description).toBe('onClick description');
      });

      it('should support returns of type void', () => {
        const docgenInfo = createPropTypesDocgenInfo({
          type: PROP_TYPE_FUNC_TYPE,
          description: 'onClick description\n@returns {void}',
        });

        const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

        expect(propDef.type.name).toBe('() => void');
        expect(propDef.description).toBe('onClick description');
      });
    });

    it('should remove extra newline characters between tags', () => {
      const docgenInfo = createPropTypesDocgenInfo({
        type: PROP_TYPE_FUNC_TYPE,
        description:
          'onClick description\n@param {SyntheticEvent} event - Original event.\n     \n     \n     \n@returns {string}',
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.type.name).toBe('(event: SyntheticEvent) => string');
      expect(propDef.description).toBe('onClick description');
    });

    it('should ignore unsupported JSDoc tags', () => {
      const docgenInfo = createPropTypesDocgenInfo({
        type: PROP_TYPE_FUNC_TYPE,
        description:
          'onClick description\n@param {SyntheticEvent} event\n@type {number}\n@returns {string}\n@version 2',
      });

      const propDef = propTypesHandler(DEFAULT_PROP_NAME, docgenInfo);

      expect(propDef.type.name).toBe('(event: SyntheticEvent) => string');
      expect(propDef.description).toBe('onClick description');
    });
  });
});

describe('ts handler', () => {
  it('should map defaults docgen info properly', () => {
    const docgenInfo = createTypeScriptDocgenInfo();
    const propDef = tsHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(propDef.name).toBe(DEFAULT_PROP_NAME);
    expect(propDef.type.name).toBe(docgenInfo.tsType.name);
    expect(propDef.description).toBe(docgenInfo.description);
    expect(propDef.required).toBe(docgenInfo.required);
    expect(propDef.defaultValue).toBe(docgenInfo.defaultValue.value);
  });
});

describe('flow handler', () => {
  it('should map defaults docgen info properly', () => {
    const docgenInfo = createFlowDocgenInfo();
    const propDef = flowHandler(DEFAULT_PROP_NAME, docgenInfo);

    expect(propDef.name).toBe(DEFAULT_PROP_NAME);
    expect(propDef.type.name).toBe(docgenInfo.flowType.name);
    expect(propDef.description).toBe(docgenInfo.description);
    expect(propDef.required).toBe(docgenInfo.required);
    expect(propDef.defaultValue).toBe(docgenInfo.defaultValue.value);
  });
});
