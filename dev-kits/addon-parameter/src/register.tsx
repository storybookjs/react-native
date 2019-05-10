import React, { Fragment, useMemo } from 'react';

import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';

type Results = string[] | undefined;

interface Props {
  active: boolean;
}

export const Panel = ({ active }: Props) => {
  const results = useParameter<Results>(PARAM_KEY, []);

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
      </div>
    ),
    [active, results]
  );

  return <Fragment>{output}</Fragment>;
};

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    title: 'parameter',
    type: types.PANEL,
    render: ({ active, key }) => <Panel key={key} active={active} />,
  });
});
