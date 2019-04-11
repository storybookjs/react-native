import React, { Fragment } from 'react';
import { styled } from '@storybook/theming';

export const interleaveSeparators = (list: any[]) =>
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

interface SeparatorProps {
  force?: boolean;
}

export const Separator = styled.span<SeparatorProps>(
  ({ theme }) => ({
    width: 1,
    height: 24,
    background: theme.appBorderColor,
    marginTop: 8,
  }),
  ({ force }) =>
    force
      ? {}
      : {
          '& + &': {
            display: 'none',
          },
        }
);
Separator.displayName = 'Separator';
