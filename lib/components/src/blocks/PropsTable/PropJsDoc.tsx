import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { isNil } from 'lodash';
import { JsDocTags } from './PropDef';

interface PropJsDocProps {
  tags: JsDocTags;
}

const TBody = styled.tbody({ boxShadow: 'none !important' });

const Cell = { paddingTop: '0 !important', paddingBottom: '0 !important' };

const Name = styled.td({
  ...Cell,
});

const Desc = styled.td({
  ...Cell,
  width: 'auto !important',
});

export const PropJsDoc: FC<PropJsDocProps> = ({ tags }) => {
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
      <TBody>
        {hasDisplayableParams &&
          params.map(x => {
            return (
              <tr key={x.name}>
                <Name>
                  <code>{x.name}</code>
                </Name>
                <Desc>{x.description}</Desc>
              </tr>
            );
          })}
        {hasDisplayableReturns && (
          <tr key="returns">
            <Name>
              <code>Returns</code>
            </Name>
            <Desc>{tags.returns.description}</Desc>
          </tr>
        )}
      </TBody>
    </table>
  );
};
