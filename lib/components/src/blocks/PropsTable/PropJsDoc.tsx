import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { isNil } from 'lodash';
import { JsDocTags } from './PropDef';
import { codeCommon } from '../../typography/shared';

interface PropJsDocProps {
  tags: JsDocTags;
}

export const Table = styled.table(({ theme }) => ({
  '&&': {
    // Escape default table styles
    borderCollapse: 'collapse',
    borderSpacing: 0,
    border: 'none',

    tr: {
      border: 'none !important',
      background: 'none',
    },

    'td, th': {
      padding: 0,
      border: 'none',
      width: 'auto!important',
    },
    // End escape

    marginTop: 0,
    marginBottom: 0,

    'th:first-of-type, td:first-of-type': {
      paddingLeft: 0,
    },

    'th:last-of-type, td:last-of-type': {
      paddingRight: 0,
    },

    td: {
      paddingTop: 0,
      paddingBottom: 4,

      '&:not(:first-of-type)': {
        paddingLeft: 10,
        paddingRight: 0,
      },
    },

    tbody: {
      boxShadow: 'none',
      border: 'none',
    },

    code: codeCommon({ theme }),

    '& code': {
      margin: 0,
      display: 'inline-block',
    },
  },
}));

export const PropJsDoc: FC<PropJsDocProps> = ({ tags }) => {
  const params = (tags.params || []).filter(x => x.description);
  const hasDisplayableParams = params.length !== 0;
  const hasDisplayableReturns = !isNil(tags.returns) && !isNil(tags.returns.description);

  if (!hasDisplayableParams && !hasDisplayableReturns) {
    return null;
  }

  return (
    <Table>
      <tbody>
        {hasDisplayableParams &&
          params.map(x => {
            return (
              <tr key={x.name}>
                <td>
                  <code>{x.name}</code>
                </td>
                <td>{x.description}</td>
              </tr>
            );
          })}
        {hasDisplayableReturns && (
          <tr key="returns">
            <td>
              <code>Returns</code>
            </td>
            <td>{tags.returns.description}</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};
