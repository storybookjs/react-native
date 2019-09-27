import React from 'react';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';
import { PropDef } from './PropDef';

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

interface PropRowProps {
  row: PropDef;
  // FIXME: row options
}

const Name = styled.span({ fontWeight: 'bold' });

const Required = styled.span<{}>(({ theme }) => ({
  color: theme.color.negative,
  fontFamily: theme.typography.fonts.mono,
  cursor: 'help',
}));

const StyledPropDef = styled.div<{}>(({ theme }) => ({
  color:
    theme.base === 'light'
      ? transparentize(0.4, theme.color.defaultText)
      : transparentize(0.6, theme.color.defaultText),
  fontFamily: theme.typography.fonts.mono,
  fontSize: `${theme.typography.size.code}%`,
}));

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
    case PropType.ARRAYOF:
      return `[ ${prettyPrint(type.value)} ]`;
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

export const PrettyPropType: React.FunctionComponent<PrettyPropTypeProps> = ({ type }) => (
  <span>{prettyPrint(type)}</span>
);

export const PrettyPropVal: React.FunctionComponent<PrettyPropValProps> = ({ value }) => (
  <span>{JSON.stringify(value)}</span>
);

export const PropRow: React.FunctionComponent<PropRowProps> = ({
  row: { name, type, required, description, defaultValue },
}) => (
  <tr>
    <td>
      <Name>{name}</Name>
      {required ? <Required title="Required">*</Required> : null}
    </td>
    <td>
      <div>{description}</div>
      <StyledPropDef>
        <PrettyPropType type={type} />
      </StyledPropDef>
    </td>
    <td>{defaultValue === undefined ? '-' : <PrettyPropVal value={defaultValue} />}</td>
  </tr>
);
