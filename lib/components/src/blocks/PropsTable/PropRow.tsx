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

const Description = styled.div({
  '&&': {
    p: {
      margin: '0',
    },
  },
});

const Type = styled.div<{ hasDescription: boolean }>(({ theme, hasDescription }) => ({
  color: theme.color.dark,
  marginTop: hasDescription ? '3px' : '0',
}));

const TypeWithJsDoc = styled.div(({ theme }) => ({
  color: theme.color.darker,
  marginTop: '12px',
  marginBottom: '12px',
}));

export const PropRow: FC<PropRowProps> = ({
  row: { name, type, required, description, defaultValue, jsDocTags },
}) => {
  const hasDescription = !isNil(description) && description !== '';

  return (
    <tr>
      <td>
        <Name>{name}</Name>
        {required ? <Required title="Required">*</Required> : null}
      </td>
      <td>
        {hasDescription && (
          <Description>
            <Markdown>{description}</Markdown>
          </Description>
        )}
        {!isNil(jsDocTags) ? (
          <>
            <TypeWithJsDoc>
              <PropValue value={type} />
            </TypeWithJsDoc>
            <PropJsDoc tags={jsDocTags} />
          </>
        ) : (
          <Type hasDescription={hasDescription}>
            <PropValue value={type} />
          </Type>
        )}
      </td>
      <td>
        <PropValue value={defaultValue} />
      </td>
    </tr>
  );
};
