import React, { FC } from 'react';
import Markdown from 'markdown-to-jsx';
import { styled } from '@storybook/theming';
import { transparentize } from 'polished';
import { isNil } from 'lodash';
import { PropDef, JsDocTags } from './PropDef';

interface JsDocParamsAndReturnsProps {
  tags: JsDocTags;
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
          params.map(x => {
            return (
              <tr key={x.name}>
                <JsDocNameCell>
                  <code>{x.name}</code>
                </JsDocNameCell>
                <JsDocDescCell>{x.description}</JsDocDescCell>
              </tr>
            );
          })}
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
        <span>{type}</span>
      </StyledPropDef>
      <JsDocParamsAndReturns tags={jsDocTags} />
    </td>
    <td>{isNil(defaultValue) ? '-' : <span>{JSON.stringify(defaultValue)}</span>}</td>
  </tr>
);
