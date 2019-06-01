import React from 'react';
import GraphiQL from 'graphiql';
import { fetch } from 'global';
import 'graphiql/graphiql.css';

import { FullScreen } from './components/FullScreen';

const FETCH_OPTIONS = {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
};

function getDefautlFetcher(url: string) {
  return (params: FetcherParams) => {
    const body = JSON.stringify(params);
    const options = Object.assign({ body }, FETCH_OPTIONS);
    return fetch(url, options).then((res: any) => res.json());
  };
}

function reIndentQuery(query: string) {
  const lines = query.split('\n');
  const spaces = lines[lines.length - 1].length - 1;
  return lines.map((l: string, i: number) => (i === 0 ? l : l.slice(spaces))).join('\n');
}

export interface FetcherParams {
  query: string;
  variables?: string;
  operationName?: string;
}

interface SetupGraphiQLConfig {
  url: string;
  fetcher: (params: FetcherParams) => any;
}

export function setupGraphiQL(config: SetupGraphiQLConfig) {
  return (_query: string, variables = '{}') => {
    const query = reIndentQuery(_query);
    const fetcher = config.fetcher || getDefautlFetcher(config.url);
    return () => (
      <FullScreen>
        <GraphiQL query={query} variables={variables} fetcher={fetcher} />
      </FullScreen>
    );
  };
}
