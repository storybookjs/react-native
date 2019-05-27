import React from 'react';
import GraphiQL from 'graphiql';
import { fetch } from 'global';
import 'graphiql/graphiql.css';

import { FullScreen } from './components/FullScreen';

const FETCH_OPTIONS = {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
};

function getDefautlFetcher(url: any) {
  return (params: any) => {
    const body = JSON.stringify(params);
    const options = Object.assign({ body }, FETCH_OPTIONS);
    return fetch(url, options).then((res: any) => res.json());
  };
}

function reIndentQuery(query: any) {
  const lines = query.split('\n');
  const spaces = lines[lines.length - 1].length - 1;
  return lines.map((l: any, i: any) => (i === 0 ? l : l.slice(spaces))).join('\n');
}

export function setupGraphiQL(config: any) {
  return (_query: any, variables = '{}') => {
    const query = reIndentQuery(_query);
    const fetcher = config.fetcher || getDefautlFetcher(config.url);
    return () => (
      <FullScreen>
        <GraphiQL query={query} variables={variables} fetcher={fetcher} />
      </FullScreen>
    );
  };
}
