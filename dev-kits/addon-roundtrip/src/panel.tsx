import React, { Fragment, memo } from 'react';
import { useAddonState, useChannel } from '@storybook/api';
import { ActionBar } from '@storybook/components';
import { ADDON_ID, EVENTS } from './constants';

type Results = string[];

interface ContentProps {
  results: Results;
}

const Content = memo(({ results }: ContentProps) => (
  <Fragment>
    {results.length ? (
      <ol>
        {results.map((i: string) => (
          <li>{i}</li>
        ))}
      </ol>
    ) : null}
  </Fragment>
));

export const Panel = () => {
  const [results, setState] = useAddonState<Results>(ADDON_ID, []);
  const emit = useChannel({
    [EVENTS.RESULT]: (newResults: Results) => setState(newResults),
  });

  return (
    <Fragment>
      <Content results={results} />
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
    </Fragment>
  );
};
