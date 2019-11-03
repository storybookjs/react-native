import doctrine, { Annotation } from 'doctrine';
import { PropDef } from '@storybook/components';
import { isNil } from 'lodash';

export type ParseJsDoc = (propDef: PropDef) => JsDocParsingResult;

export interface JsDocParsingResult {
  type?: {
    name: string;
  };
  description?: string;
  tags?: any;
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

function parseComment(comment: string): Annotation {
  let ast;

  try {
    ast = doctrine.parse(comment, {
      tags: ['param', 'arg', 'argument', 'returns'],
      sloppy: true,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);

    throw new Error('Cannot parse JSDoc tags.');
  }

  return ast;
}

export const parseJsDoc: ParseJsDoc = (propDef: PropDef) => {
  let type;
  let description;
  const tags: any = {};

  const jsDocAst = parseComment(propDef.description);

  // Always use the parsed description to ensure JSDoc is removed from the description.
  if (!isNil(jsDocAst.description)) {
    description = jsDocAst.description;
  }

  const extractedTags = extractJsDocTags(jsDocAst);
  const hasParams = extractedTags.params.length > 0;
  const hasReturnType = !isNil(extractedTags.returns) && !isNil(extractedTags.returns.type);

  if (hasParams || hasReturnType) {
    if (propDef.type.name === 'func') {
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
      } else {
        funcParts.push('()');
      }

      if (hasReturnType) {
        funcParts.push(`=> ${extractedTags.returns.type}`);
      }

      type = {
        name: funcParts.join(' '),
      };
    }

    if (hasParams) {
      tags.params = extractedTags.params.map(x => x.raw);
    }

    if (hasReturnType) {
      tags.returns = extractedTags.returns.raw;
    }
  }

  return {
    type: !isNil(type) ? type : undefined,
    description: !isNil(description) ? description : undefined,
    tags: Object.keys(tags).length !== 0 ? tags : undefined,
  };
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
