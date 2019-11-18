import React, { FC } from 'react';
import Markdown from 'markdown-to-jsx';
import { isNil } from 'lodash';
import { styled } from '@storybook/theming';
import { PropDef } from './PropDef';
import { PropJsDoc } from './PropJsDoc';
import { PropValue } from './PropValue';

export interface PropRowProps {
  row: PropDef;
}

const Name = styled.span({ fontWeight: 'bold' });

const Required = styled.span(({ theme }) => ({
  color: theme.color.negative,
  fontFamily: theme.typography.fonts.mono,
  cursor: 'help',
}));

const Type = styled.div(({ theme }) => ({
  color: theme.color.dark,
  fontFamily: theme.typography.fonts.mono,
  fontSize: `${theme.typography.size.code}%`,
}));

const TypeWithJsDoc = styled.div(({ theme }) => ({
  color: theme.color.darker,
  marginTop: '12px',
  marginBottom: '12px',
}));

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
      {!isNil(jsDocTags) ? (
        <TypeWithJsDoc>
          <PropValue value={type} />
        </TypeWithJsDoc>
      ) : (
        <Type>
          <PropValue value={type} />
        </Type>
      )}
      <PropJsDoc tags={jsDocTags} />
    </td>
    <td>
      <PropValue value={defaultValue} />
    </td>
  </tr>
);
