import React, { FC } from 'react';
import Markdown from 'markdown-to-jsx';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';
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
  color:
    theme.base === 'light'
      ? transparentize(0.4, theme.color.defaultText)
      : transparentize(0.6, theme.color.defaultText),
  fontFamily: theme.typography.fonts.mono,
  fontSize: `${theme.typography.size.code}%`,
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
      <Type>
        <PropValue value={type} />
      </Type>
      <PropJsDoc tags={jsDocTags} />
    </td>
    <td>
      <PropValue value={defaultValue} />
    </td>
  </tr>
);
