import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { isNil } from 'lodash';
import { JsDocTags } from './PropDef';

interface PropJsDocProps {
  tags: JsDocTags;
}

export const Table = styled.table<{}>(({ theme }) => ({
  '&&': {
    // Resets for cascading/system styles
    borderCollapse: 'collapse',
    borderSpacing: 0,
    color: theme.color.defaultText,
    border: 'none',

    tr: {
      border: 'none',
      background: 'none',
    },

    'td, th': {
      padding: 0,
      border: 'none',
      width: 'auto!important',
    },
    // End Resets

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
      paddingRight: '20px',
      width: '20%',
    },

    th: {
      paddingTop: 10,
      paddingBottom: 10,

      '&:not(:first-of-type)': {
        paddingLeft: 12,
        paddingRight: 12,
      },
    },

    td: {
      paddingTop: '8px',
      paddingBottom: '8px',

      '&:not(:first-of-type)': {
        paddingLeft: 12,
        paddingRight: 12,
      },

      '&:last-of-type': {
        paddingRight: '20px',
      },
    },

    'tr:first-child': {
      'td:first-child, th:first-child': {
        borderTopLeftRadius: 0,
      },
      'td:last-child, th:last-child': {
        borderTopRightRadius: 0,
      },
    },

    code: {
      backgroundColor: theme.color.lighter,
      padding: '4px',
      borderRadius: '4px',
      color: theme.color.darker,
      fontSize: theme.typography.size.s2,
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

      td: {
        background: theme.background.content,
        border: 'none',
        width: 'auto',
        color: theme.color.darker,
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
