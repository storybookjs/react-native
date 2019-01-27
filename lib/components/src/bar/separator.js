import React, { Fragment } from 'react';
import { styled } from '@storybook/theming';

export const interleaveSeparators = list =>
  list.reduce(
    (acc, item, index) =>
      item ? (
        <Fragment key={item.id || item.key || `f-${index}`}>
          {acc}
          {index > 0 ? <Separator key={`s-${index}`} /> : null}
          {item.render() || item}
        </Fragment>
      ) : (
        acc
      ),
    null
  );

export const Separator = styled.span(
  ({ theme }) => ({
    width: 1,
    height: 24,
    background: theme.mainBorderColor,
    marginTop: 8,
  }),
  {
    '& + &': {
      display: 'none',
    },
  }
);
