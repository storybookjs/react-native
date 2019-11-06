import React, { FC } from 'react';
import Markdown from 'markdown-to-jsx';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';
import { isNil } from 'lodash';
import { PropDef, PropDefJsDocTags } from './PropDef';

enum PropType {
  SHAPE = 'shape',
  UNION = 'union',
  ARRAYOF = 'arrayOf',
  OBJECTOF = 'objectOf',
  ENUM = 'enum',
  INSTANCEOF = 'instanceOf',
}

interface PrettyPropTypeProps {
  type: any;
}

interface PrettyPropValProps {
  value: any;
}

interface JsDocParamsAndReturnsProps {
  tags: PropDefJsDocTags;
}

export interface PropRowProps {
  row: PropDef;
  // FIXME: row options
}

const Name = styled.span({ fontWeight: 'bold' });

const Required = styled.span(({ theme }) => ({
  color: theme.color.negative,
  fontFamily: theme.typography.fonts.mono,
  cursor: 'help',
}));

const StyledPropDef = styled.div(({ theme }) => ({
  color:
    theme.base === 'light'
      ? transparentize(0.4, theme.color.defaultText)
      : transparentize(0.6, theme.color.defaultText),
  fontFamily: theme.typography.fonts.mono,
  fontSize: `${theme.typography.size.code}%`,
}));

const JsDocParamsAndReturnsTBody = styled.tbody({ boxShadow: 'none !important' });

const JsDocCellStyle = { paddingTop: '0 !important', paddingBottom: '0 !important' };

const JsDocNameCell = styled.td({
  ...JsDocCellStyle,
});

const JsDocDescCell = styled.td({
  ...JsDocCellStyle,
  width: 'auto !important',
});

const prettyPrint = (type: any): string => {
  if (!type || !type.name) {
    return '';
  }
  let fields = '';
  switch (type.name) {
    case PropType.SHAPE:
      fields = Object.keys(type.value)
        .map((key: string) => `${key}: ${prettyPrint(type.value[key])}`)
        .join(', ');
      return `{ ${fields} }`;
    case PropType.UNION:
      return Array.isArray(type.value)
        ? `Union<${type.value.map(prettyPrint).join(' | ')}>`
        : JSON.stringify(type.value);
    case PropType.ARRAYOF: {
      let shape = type.value.name;

      if (shape === 'custom') {
        if (type.value.raw) {
          shape = type.value.raw.replace(/PropTypes./g, '').replace(/.isRequired/g, '');
        }
      }

      return `[ ${shape} ]`;
    }
    case PropType.OBJECTOF:
      return `objectOf(${prettyPrint(type.value)})`;
    case PropType.ENUM:
      if (type.computed) {
        return JSON.stringify(type);
      }
      return Array.isArray(type.value)
        ? type.value.map((v: any) => v && v.value && v.value.toString()).join(' | ')
        : JSON.stringify(type);
    case PropType.INSTANCEOF:
      return `instanceOf(${JSON.stringify(type.value)})`;
    default:
      return type.name;
  }
};

export const PrettyPropType: FC<PrettyPropTypeProps> = ({ type }) => (
  <span>{prettyPrint(type)}</span>
);

export const PrettyPropVal: FC<PrettyPropValProps> = ({ value }) => (
  <span>{JSON.stringify(value)}</span>
);

const JsDocParamsAndReturns: FC<JsDocParamsAndReturnsProps> = ({ tags }) => {
  if (isNil(tags)) {
    return null;
  }

  const params = (tags.params || []).filter(x => x.description);
  const hasDisplayableParams = params.length !== 0;
  const hasDisplayableReturns = !isNil(tags.returns) && !isNil(tags.returns.description);

  if (!hasDisplayableParams && !hasDisplayableReturns) {
    return null;
  }

  return (
    <table>
      <JsDocParamsAndReturnsTBody>
        {hasDisplayableParams &&
          params.map(x => (
            <tr key={x.name}>
              <JsDocNameCell>
                <code>{x.name}</code>
              </JsDocNameCell>
              <JsDocDescCell>{x.description}</JsDocDescCell>
            </tr>
          ))}
        {hasDisplayableReturns && (
          <tr key="returns">
            <JsDocNameCell>
              <code>Returns</code>
            </JsDocNameCell>
            <JsDocDescCell>{tags.returns.description}</JsDocDescCell>
          </tr>
        )}
      </JsDocParamsAndReturnsTBody>
    </table>
  );
};

export const PropRow: FC<PropRowProps> = ({
  row: { name, type, required, description, defaultValue, jsDocTags },
}) => (
  <tr>
    <td>
      <Name>{name}</Name>
      {required ? <Required title="Required">*</Required> : null}
    </td>
    <td>
      <Markdown>{description || ''}</Markdown>
      <StyledPropDef>
        <PrettyPropType type={type} />
      </StyledPropDef>
      <JsDocParamsAndReturns tags={jsDocTags} />
    </td>
    <td>{isNil(defaultValue) ? '-' : <PrettyPropVal value={defaultValue} />}</td>
  </tr>
);
