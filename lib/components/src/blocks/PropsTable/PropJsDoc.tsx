import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { isNil } from 'lodash';
import { JsDocTags } from './PropDef';
import { codeCommon } from '../../typography/DocumentFormatting';

interface PropJsDocProps {
  tags: JsDocTags;
}

export const Table = styled.table<{}>(({ theme }) => ({
  '&&': {
    // Escape default table styles
    'td, th': {
      padding: 0,
      border: 'none',
      width: 'auto!important',
    },
    // End escape

    fontSize: theme.typography.size.s2,
    lineHeight: '20px',
    textAlign: 'left',
    width: '100%',

    marginTop: '0',
    marginBottom: '0',

    'th:first-of-type, td:first-of-type': {
      paddingLeft: 0,
    },

    'th:last-of-type, td:last-of-type': {
      paddingRight: 0,
    },

    td: {
      paddingTop: '0',
      paddingBottom: '4px',

      '&:not(:first-of-type)': {
        paddingLeft: 10,
        paddingRight: 0,
      },
    },

    code: codeCommon({ theme }),

    '& code': {
      lineHeight: '18px',
      margin: 0,
      display: 'inline-block',
    },

    tbody: {
      boxShadow: 'none',
      border: 'none',

      tr: {
        background: 'transparent',
        overflow: 'hidden',
        '&:not(:first-child)': {
          borderTopWidth: 0,
        },
      },
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
