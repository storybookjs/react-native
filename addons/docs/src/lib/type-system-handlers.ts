import { PropDef } from '@storybook/components';
import { isNil } from 'lodash';
import { parseComment, JsDocAst } from './jsdoc-parser';

export interface DocgenInfo {
  type?: {
    name: string;
  };
  flowType?: any;
  tsType?: any;
  required: boolean;
  description?: string;
  defaultValue?: {
    value: string;
  };
}

interface JsDocParamTag {
  name: string;
  type?: string;
  description?: string;
}

interface JsDocReturnsTag {
  type?: string;
  description?: string;
}

interface ExtractedJsDocTags {
  params: JsDocParamTag[];
  returns?: JsDocReturnsTag;
}

export const TypeSystem = {
  Flow: 'Flow',
  TypeScript: 'TypeScript',
  PropTypes: 'PropTypes',
  Unknown: 'Unknown',
};

export type TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => PropDef;

function createDefaultPropDef(propName: string, docgenInfo: DocgenInfo): PropDef {
  const { description, required, defaultValue } = docgenInfo;

  return {
    name: propName,
    type: null,
    required,
    description,
    defaultValue: isNil(defaultValue) ? null : defaultValue.value,
  };
}

export const propTypesHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  const propDef = createDefaultPropDef(propName, docgenInfo);
  propDef.type = docgenInfo.type;

  if (!isNil(propDef.description)) {
    if (propDef.description.includes('@')) {
      const jsDocAst = parseComment(propDef.description);

      // Always use the parsed description to ensure JSDoc is removed from the description.
      if (!isNil(jsDocAst.description)) {
        propDef.description = jsDocAst.description;
      }

      if (propDef.type.name === 'func') {
        const tags = extractJsDocTags(jsDocAst);
        const hasParams = tags.params.length > 0;
        const hasReturnType = !isNil(tags.returns) && !isNil(tags.returns.type);

        if (hasParams || hasReturnType) {
          const funcParts = [];

          if (hasParams) {
            const funcParams = tags.params.map((x: any) => {
              if (x.name && x.type) {
                return `${x.name}: ${x.type}`;
              }

              if (x.name) {
                return x.name;
              }

              return x.type;
            });

            funcParts.push(`(${funcParams.join(', ')})`);
          } else {
            funcParts.push('()');
          }

          if (hasReturnType) {
            funcParts.push(`=> ${tags.returns.type}`);
          }

          propDef.type = {
            name: funcParts.join(' '),
          };
        }
      }
    }
  }

  return propDef;
};

function extractJsDocTags(ast: JsDocAst): Record<string, any> {
  const tags: ExtractedJsDocTags = {
    params: [],
    returns: null,
  };

  ast.tags.forEach(tag => {
    // arg & argument are aliases for param.
    if (tag.title === 'param' || tag.title === 'arg' || tag.title === 'argument') {
      // When the @param doesn't have a name but have a type and a description, "null-null" is returned.
      if (tag.name !== 'null-null') {
        let paramName = tag.name;

        if (paramName.includes('null')) {
          // There is a few cases in which the returned param name contains "null".
          // - @param {SyntheticEvent} event- Original SyntheticEvent
          // - @param {SyntheticEvent} event.\n@returns {string}
          paramName = paramName.replace('-null', '').replace('.null', '');
        }

        let paramType;

        if (!isNil(tag.type)) {
          const extractedTypeName = extractJsDocTypeName(tag.type);

          if (!isNil(extractedTypeName)) {
            paramType = extractedTypeName;
          }
        }

        tags.params.push({
          name: paramName,
          type: paramType,
          description: tag.description,
        });
      }
    } else if (tag.title === 'returns') {
      if (!isNil(tag.type)) {
        tags.returns = {
          type: extractJsDocTypeName(tag.type),
          description: tag.description,
        };
      }
    }
  });

  return tags;
}

function extractJsDocTypeName(type: any): string {
  if (type.type === 'NameExpression') {
    return type.name;
  }

  if (type.type === 'RecordType') {
    const recordFields = type.fields.map((field: any) => {
      if (!isNil(field.value)) {
        const valueTypeName = extractJsDocTypeName(field.value);

        return `${field.key}: ${valueTypeName}`;
      }

      return field.key;
    });

    return `({${recordFields.join(', ')}})`;
  }

  if (type.type === 'UnionType') {
    const unionElements = type.elements.map(extractJsDocTypeName);

    return `(${unionElements.join('|')})`;
  }

  // Only support untyped array: []. Might add more support later if required.
  if (type.type === 'ArrayType') {
    return '[]';
  }

  if (type.type === 'TypeApplication') {
    if (!isNil(type.expression)) {
      if (type.expression.name === 'Array') {
        const arrayType = extractJsDocTypeName(type.applications[0]);

        return `${arrayType}[]`;
      }
    }
  }

  if (
    type.type === 'NullableType' ||
    type.type === 'NonNullableType' ||
    type.type === 'OptionalType'
  ) {
    return extractJsDocTypeName(type.expression);
  }

  if (type.type === 'AllLiteral') {
    return 'any';
  }

  return null;
}

export const tsHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  const propDef = createDefaultPropDef(propName, docgenInfo);
  propDef.type = docgenInfo.tsType;

  return propDef;
};

export const flowHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  const propDef = createDefaultPropDef(propName, docgenInfo);
  propDef.type = docgenInfo.flowType;

  return propDef;
};

export const unknownHandler: TypeSystemHandler = (propName: string, docgenInfo: DocgenInfo) => {
  const propDef = createDefaultPropDef(propName, docgenInfo);
  propDef.type = { name: 'unknown' };

  return propDef;
};

export const TypeSystemHandlers: Record<string, TypeSystemHandler> = {
  [TypeSystem.Flow]: flowHandler,
  [TypeSystem.TypeScript]: tsHandler,
  [TypeSystem.PropTypes]: propTypesHandler,
  [TypeSystem.Unknown]: unknownHandler,
};

export const getPropTypeSystem = (docgenInfo: DocgenInfo): string => {
  if (!isNil(docgenInfo.flowType)) {
    return TypeSystem.Flow;
  }

  if (!isNil(docgenInfo.tsType)) {
    return TypeSystem.TypeScript;
  }

  if (!isNil(docgenInfo.type)) {
    return TypeSystem.PropTypes;
  }

  return TypeSystem.Unknown;
};

export const getTypeSystemHandler = (typeSystem: string): TypeSystemHandler => {
  return TypeSystemHandlers[typeSystem];
};
