import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const toNumber = input => (typeof input === 'number' ? input : Number(input));

const Container = styled.div(
  ({ theme, col, row = 1 }) =>
    col
      ? {
          display: 'inline-block',
          verticalAlign: 'inherit',
          '& > *': {
            marginLeft: col * theme.layoutMargin,
            verticalAlign: 'inherit',
          },
          '& > *:first-child': {
            marginLeft: 0,
          },
        }
      : {
          '& > *': {
            marginTop: row * theme.layoutMargin,
          },
          '& > *:first-child': {
            marginTop: 0,
          },
        },
  ({ theme, outer, col, row }) => {
    switch (true) {
      case !!(outer && col): {
        return {
          marginLeft: outer * theme.layoutMargin,
          marginRight: outer * theme.layoutMargin,
        };
      }
      case !!(outer && row): {
        return {
          marginTop: outer * theme.layoutMargin,
          marginBottom: outer * theme.layoutMargin,
        };
      }
      default: {
        return {};
      }
    }
  }
);

export const Spaced = ({ col, row, outer, children }) => {
  const outerAmount = toNumber(typeof outer === 'number' || !outer ? outer : col || row);

  return (
    <Container col={col} row={row} outer={outerAmount}>
      {children}
    </Container>
  );
};
Spaced.propTypes = {
  col: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  row: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  outer: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  children: PropTypes.node.isRequired,
};
Spaced.defaultProps = {
  col: undefined,
  row: undefined,
  outer: undefined,
};
