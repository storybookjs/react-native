import React, { useMemo } from 'react';

import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { AddonPanel } from '@storybook/components';
import { ADDON_ID, PANEL_ID, PARAM_KEY } from './constants';

type Results = string[] | undefined;

export const Content = () => {
  const results = useParameter<Results>(PARAM_KEY, []);

  return useMemo(
    () =>
      results.length ? (
        <ol>
          {results.map((i: string) => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null,
    [results]
  );
};

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    title: 'parameter',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
