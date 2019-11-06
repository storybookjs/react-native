import doctrine, { Annotation } from 'doctrine';
import { isNil } from 'lodash';
import { DocgenInfo } from './DocgenInfo';

export type ParseJsDoc = (docgenInfo: DocgenInfo) => JsDocParsingResult;

export interface JsDocParsingResult {
  ignore: boolean;
  description?: string;
  extractedTags?: ExtractedJsDocTags;
}

export interface ExtractedJsDocParamTag {
  name: string;
  type?: doctrine.Type;
  description?: string;
  raw: doctrine.Tag;
  getPrettyName: () => string;
  getTypeName: () => string;
}

export interface ExtractedJsDocReturnsTag {
  type?: doctrine.Type;
  description?: string;
  raw: doctrine.Tag;
  getTypeName: () => string;
}

export interface ExtractedJsDocTags {
  params?: ExtractedJsDocParamTag[];
  returns?: ExtractedJsDocReturnsTag;
  ignore: boolean;
}

function parse(content: string): Annotation {
  let ast;

  try {
    ast = doctrine.parse(content, {
      tags: ['param', 'arg', 'argument', 'returns', 'ignore'],
      sloppy: true,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);

    throw new Error('Cannot parse JSDoc tags.');
  }

  return ast;
}

export const parseJsDoc: ParseJsDoc = (docgenInfo: DocgenInfo) => {
  const jsDocAst = parse(docgenInfo.description);
  const extractedTags = extractJsDocTags(jsDocAst);

  if (extractedTags.ignore) {
    // There is no point in doing other stuff since this prop will not be rendered.
    return {
      ignore: true,
    };
  }

  return {
    ignore: false,
    // Always use the parsed description to ensure JSDoc is removed from the description.
    description: jsDocAst.description,
    extractedTags,
  };
};

function extractJsDocTags(ast: doctrine.Annotation): ExtractedJsDocTags {
  const extractedTags: ExtractedJsDocTags = {
    params: null,
    returns: null,
    ignore: false,
  };

  for (let i = 0; i < ast.tags.length; i += 1) {
    const tag = ast.tags[i];

    // arg & argument are aliases for param.
    if (tag.title === 'param' || tag.title === 'arg' || tag.title === 'argument') {
      const paramName = tag.name;

      // When the @param doesn't have a name but have a type and a description, "null-null" is returned.
      if (!isNil(paramName) && paramName !== 'null-null') {
        if (isNil(extractedTags.params)) {
          extractedTags.params = [];
        }

        extractedTags.params.push({
          name: tag.name,
          type: tag.type,
          description: tag.description,
          raw: tag,
          getPrettyName: () => {
            if (paramName.includes('null')) {
              // There is a few cases in which the returned param name contains "null".
              // - @param {SyntheticEvent} event- Original SyntheticEvent
              // - @param {SyntheticEvent} event.\n@returns {string}
              return paramName.replace('-null', '').replace('.null', '');
            }

            return tag.name;
          },
          getTypeName: () => {
            return !isNil(tag.type) ? extractJsDocTypeName(tag.type) : null;
          },
        });
      }
    } else if (tag.title === 'returns') {
      if (!isNil(tag.type)) {
        extractedTags.returns = {
          type: tag.type,
          description: tag.description,
          raw: tag,
          getTypeName: () => {
            return extractJsDocTypeName(tag.type);
          },
        };
      }
    } else if (tag.title === 'ignore') {
      extractedTags.ignore = true;
      // Once we reach an @ignore tag, there is no point in parsing the other tags since we will not render the prop.
      break;
    }
  }

  return extractedTags;
}

// FIXME: type argument should be doctrine.Type instead of any.
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
