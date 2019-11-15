import * as React from 'react';
import GraphiQL from 'graphiql';

import 'graphiql/graphiql.css';

import { FullScreen } from './components/FullScreen';
import { reIndentQuery, getDefaultFetcher } from './shared';

export interface FetcherParams {
  query: string;
  variables?: string;
  operationName?: string;
}

export interface SetupGraphiQLConfig {
  url: string;
  fetcher?: (params: FetcherParams) => Promise<any>;
}

export const setupGraphiQL = (config: SetupGraphiQLConfig) => (
  _query: string,
  variables = '{}'
) => {
  const query = reIndentQuery(_query);
  const fetcher = config.fetcher || getDefaultFetcher(config.url);
  return () => (
    <FullScreen>
      <GraphiQL query={query} variables={variables} fetcher={fetcher} />
    </FullScreen>
  );
};
