import doctrine, { Annotation } from 'doctrine';
import { PropDef } from '@storybook/components';
import { isNil } from 'lodash';

export interface PropTypeHandlerContext {
  hasParams: boolean;
  hasReturns: boolean;
}

export type PropTypeHandler = (
  propDef: PropDef,
  extractedTags: ExtractedJsDocTags,
  context: PropTypeHandlerContext
) => Record<string, any> | null;

export interface JsDocParsingOptions {
  propTypeHandlers?: Record<string, PropTypeHandler>;
}

export type ParseJsDoc = (
  propDef: PropDef,
  options?: JsDocParsingOptions
) => JsDocParsingResult & Record<string, any>;

export interface JsDocParsingResult {
  ignore: boolean;
}

export interface ExtractedJsDocParamTag {
  name: string;
  type?: doctrine.Type;
  description?: string;
  raw: doctrine.Tag;
  getTypeName: () => string;
}

export interface ExtractedJsDocReturnsTag {
  type?: doctrine.Type;
  description?: string;
  raw: doctrine.Tag;
  getTypeName: () => string;
}

export interface ExtractedJsDocTags {
  params: ExtractedJsDocParamTag[];
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
    console.log(e);

    throw new Error('Cannot parse JSDoc tags.');
  }

  return ast;
}

export const parseJsDoc: ParseJsDoc = (propDef: PropDef, options: JsDocParsingOptions = {}) => {
  let description;
  const tags: any = {};

  const jsDocAst = parse(propDef.description);

  // Always use the parsed description to ensure JSDoc is removed from the description.
  if (!isNil(jsDocAst.description)) {
    description = jsDocAst.description;
  }

  const extractedTags = extractJsDocTags(jsDocAst, options);

  // There is no point in doing other stuff since this prop will not be rendered.
  if (extractedTags.ignore) {
    return {
      ignore: true,
    };
  }

  const hasParams = extractedTags.params.length > 0;
  const hasReturns = !isNil(extractedTags.returns) && !isNil(extractedTags.returns.type);

  if (hasParams) {
    tags.params = extractedTags.params.map(x => x.raw);
  }

  if (hasReturns) {
    tags.returns = extractedTags.returns.raw;
  }

  let result = {
    description: !isNil(description) ? description : undefined,
    jsDocTags: Object.keys(tags).length !== 0 ? tags : undefined,
    ignore: false,
  };

  if (!isNil(options.propTypeHandlers)) {
    const handler = options.propTypeHandlers[propDef.type.name];

    if (!isNil(handler)) {
      const additionalResult = handler(propDef, extractedTags, {
        hasParams,
        hasReturns,
      });

      if (!isNil(additionalResult)) {
        result = {
          ...result,
          ...additionalResult,
        };
      }
    }
  }

  return result;
};

function extractJsDocTags(
  ast: doctrine.Annotation,
  options: JsDocParsingOptions
): ExtractedJsDocTags {
  const extractedTags: ExtractedJsDocTags = {
    params: [],
    returns: null,
    ignore: false,
  };

  for (let i = 0; i < ast.tags.length; i += 1) {
    const tag = ast.tags[i];

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

        if (!isNil(paramName)) {
          extractedTags.params.push({
            name: paramName,
            type: tag.type,
            description: tag.description,
            raw: tag,
            getTypeName: () => {
              return !isNil(tag.type) ? extractJsDocTypeName(tag.type) : null;
            },
          });
        }
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
