import React from 'react';
import { styled } from '@storybook/theming';
import { opacify, transparentize } from 'polished';
import { PropRow } from './PropRow';
import { PropDef } from './PropDef';
import { EmptyBlock } from '../EmptyBlock';
import { ResetWrapper } from '../../typography/DocumentFormatting';

export const Table = styled.table<{}>(({ theme }) => ({
  '&&': {
    // Resets for cascading/system styles
    borderCollapse: 'collapse',
    borderSpacing: 0,
    color: theme.color.defaultText,
    tr: {
      border: 'none',
      background: 'none',
    },

    'td, th': {
      padding: 0,
      border: 'none',
    },
    // End Resets

    fontSize: theme.typography.size.s2,
    lineHeight: '20px',
    textAlign: 'left',
    width: '100%',

    // Margin collapse
    marginTop: '25px',
    marginBottom: '40px',

    'th:first-of-type, td:first-of-type': {
      paddingLeft: 20,
    },

    'th:last-of-type, td:last-of-type': {
      paddingRight: '20px',
      width: '20%',
    },

    th: {
      color:
        theme.base === 'light'
          ? transparentize(0.4, theme.color.defaultText)
          : transparentize(0.6, theme.color.defaultText),
      paddingTop: 10,
      paddingBottom: 10,

      '&:not(:first-of-type)': {
        paddingLeft: 15,
        paddingRight: 15,
      },
    },

    td: {
      paddingTop: '16px',
      paddingBottom: '16px',

      '&:not(:first-of-type)': {
        paddingLeft: 15,
        paddingRight: 15,
      },

      '&:last-of-type': {
        paddingRight: '20px',
      },
    },

    // Table "block" styling
    // Emphasize tbody's background and set borderRadius
    // Calling out because styling tables is finicky

    // Makes border alignment consistent w/other DocBlocks
    marginLeft: 1,
    marginRight: 1,

    'tr:first-child td:first-child': {
      borderTopLeftRadius: theme.appBorderRadius,
    },

    'tr:first-child td:last-child': {
      borderTopRightRadius: theme.appBorderRadius,
    },
    'tr:last-child td:first-child': {
      borderBottomLeftRadius: theme.appBorderRadius,
    },

    'tr:last-child td:last-child': {
      borderBottomRightRadius: theme.appBorderRadius,
    },

    tbody: {
      // slightly different than the other DocBlock shadows to account for table styling gymnastics
      boxShadow:
        theme.base === 'light'
          ? `rgba(0, 0, 0, 0.10) 0 1px 3px 1px,
          ${transparentize(0.035, theme.appBorderColor)} 0 0 0 1px`
          : `rgba(0, 0, 0, 0.20) 0 2px 5px 1px,
          ${opacify(0.05, theme.appBorderColor)} 0 0 0 1px`,
      borderRadius: theme.appBorderRadius,

      tr: {
        background: 'transparent',
        '&:not(:first-child)': {
          borderTop: `1px solid ${theme.appBorderColor}`,
        },
      },

      td: {
        background: theme.background.content,
      },
    },
    // End finicky table styling
  },
}));

export enum PropsTableError {
  NO_COMPONENT = 'No component found',
  PROPS_UNSUPPORTED = 'Props unsupported. See Props documentation for your framework.',
}

export interface PropsTableRowsProps {
  rows: PropDef[];
}

export interface PropsTableErrorProps {
  error: PropsTableError;
}

export type PropsTableProps = PropsTableRowsProps | PropsTableErrorProps;

/**
 * Display the props for a component as a props table. Each row is a collection of
 * PropDefs, usually derived from docgen info for the component.
 */
const PropsTable: React.FunctionComponent<PropsTableProps> = props => {
  const { error } = props as PropsTableErrorProps;
  if (error) {
    return <EmptyBlock>{error}</EmptyBlock>;
  }

  const { rows } = props as PropsTableRowsProps;
  if (rows.length === 0) {
    return <EmptyBlock>No props found for this component</EmptyBlock>;
  }
  return (
    <ResetWrapper>
      <Table className="docblock-propstable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Default</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <PropRow key={row.name} row={row} />
          ))}
        </tbody>
      </Table>
    </ResetWrapper>
  );
};

export { PropsTable, PropDef };
