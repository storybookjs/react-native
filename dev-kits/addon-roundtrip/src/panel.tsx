import React, { Fragment, useMemo } from 'react';
import { useAddonState, useChannel } from '@storybook/api';
import { ActionBar } from '@storybook/components';
import { ADDON_ID, EVENTS } from './constants';

type Results = string[];

interface Props {
  active: boolean;
}

export const Panel = ({ active }: Props) => {
  const [results, setState] = useAddonState<Results>(ADDON_ID, []);
  const emit = useChannel({
    [EVENTS.RESULT]: (newResults: Results) => setState(newResults),
  });

  const output = useMemo(
    () => (
      <div hidden={!active}>
        {results.length ? (
          <ol>
            {results.map((i: string) => (
              <li>{i}</li>
            ))}
          </ol>
        ) : null}
        <ActionBar
          key="actionbar"
          actionItems={[
            { title: 'emit', onClick: () => emit(EVENTS.REQUEST) },
            { title: 'setState', onClick: () => setState(['foo']) },
            {
              title: 'setState with options',
              onClick: () => setState(['bar'], { persistence: 'session' }),
            },
            { title: 'setState with function', onClick: () => setState(s => [...s, 'baz']) },
          ]}
        />
      </div>
    ),
    [active, results]
  );

  return <Fragment>{output}</Fragment>;
};
/*
** addon-design-assets **
an addon took an asset (design png)
connct that asset to a panel
goal: show this side by side with component
*/
