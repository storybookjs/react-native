import React, { Fragment, useMemo } from 'react';
import { useAddonState, useChannel } from '@storybook/api';
import { ADDON_ID, EVENTS } from './constants';

type Results = string[];

interface Props {
  active: boolean;
}

export const Panel = ({ active }: Props) => {
  const { 0: results, 1: setState } = useAddonState<Results>(ADDON_ID, []);
  const emit = useChannel({
    [EVENTS.RESULT]: newResults => setState(newResults),
  });

  const output = useMemo(
    () => (
      <div hidden={!active}>
        {results.length ? (
          <ol>
            {results.map((i: string) => (
              <li key={i.toString()}>{i}</li>
            ))}
          </ol>
        ) : null}
        <button type="button" onClick={() => emit(EVENTS.REQUEST)}>
          emit
        </button>
        <button type="button" onClick={() => setState([])}>
          setState
        </button>
        <button type="button" onClick={() => setState([], { persistence: 'session' })}>
          setState with options
        </button>
        <button type="button" onClick={() => setState(s => [...s, 'foo'])}>
          setState with function
        </button>
      </div>
    ),
    [active, results]
  );

  return <Fragment>{output}</Fragment>;
};

