import { PropDef } from '@storybook/components';
import { isNil } from 'lodash';
import doctrine from 'doctrine';
import { parseComment } from './jsdoc-parser';

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

interface ExtractedJsDocParamTag {
  name: string;
  type?: string;
  description?: string;
  raw: doctrine.Tag;
}

interface ExtractedJsDocReturnsTag {
  type?: string;
  description?: string;
  raw: doctrine.Tag;
}

interface ExtractedJsDocTags {
  params: ExtractedJsDocParamTag[];
  returns?: ExtractedJsDocReturnsTag;
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

  // Take a default type value from docgen. It will be overrided later if something better can be infered from JSDoc tags.
  propDef.type = docgenInfo.type;
  propDef.jsDocTags = {};

  if (!isNil(propDef.description)) {
    if (propDef.description.includes('@')) {
      const jsDocAst = parseComment(propDef.description);

      // Always use the parsed description to ensure JSDoc is removed from the description.
      if (!isNil(jsDocAst.description)) {
        propDef.description = jsDocAst.description;
      }

      if (propDef.type.name === 'func') {
        const extractedTags = extractJsDocTags(jsDocAst);
        const hasParams = extractedTags.params.length > 0;
        const hasReturnType = !isNil(extractedTags.returns) && !isNil(extractedTags.returns.type);

        if (hasParams || hasReturnType) {
          const funcParts = [];

          if (hasParams) {
            const funcParams = extractedTags.params.map((x: any) => {
              if (x.name && x.type) {
                return `${x.name}: ${x.type}`;
              }

              if (x.name) {
                return x.name;
              }

              return x.type;
            });

            funcParts.push(`(${funcParams.join(', ')})`);
            propDef.jsDocTags.params = extractedTags.params.map(x => x.raw);
          } else {
            funcParts.push('()');
          }

          if (hasReturnType) {
            funcParts.push(`=> ${extractedTags.returns.type}`);
            propDef.jsDocTags.returns = extractedTags.returns.raw;
          }

          propDef.type = {
            name: funcParts.join(' '),
          };
        }
      }
    }
  }

  if (Object.keys(propDef.jsDocTags).length === 0) {
    // We haven't found any JSDoc tags on the prop, cleaning up.
    delete propDef.jsDocTags;
  }

  return propDef;
};

function extractJsDocTags(ast: doctrine.Annotation): ExtractedJsDocTags {
  const extractedTags: ExtractedJsDocTags = {
    params: [],
    returns: null,
  };

  ast.tags.forEach((tag: doctrine.Tag) => {
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

        extractedTags.params.push({
          name: paramName,
          type: paramType,
          description: tag.description,
          raw: tag,
        });
      }
    } else if (tag.title === 'returns') {
      if (!isNil(tag.type)) {
        extractedTags.returns = {
          type: extractJsDocTypeName(tag.type),
          description: tag.description,
          raw: tag,
        };
      }
    }
  });

  return extractedTags;
}

// FIXME: type should be doctrine.Type
function extractJsDocTypeName(type: any): string {
  if (type.type === 'NameExpression') {
    return type.name;
  }

  if (type.type === 'RecordType') {
    const recordFields = type.fields.map((field: doctrine.type.FieldType) => {
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
