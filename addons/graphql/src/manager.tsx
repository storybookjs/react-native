import { fetch } from 'global';
import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';

import { Consumer, Combo } from '@storybook/api';

import { PARAM_KEY } from '.';

const FETCH_OPTIONS = {
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
};

function getDefaultFetcher(url: string) {
  return (params: any) => {
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
interface GQLProps {
  active: boolean;
}

const GQL: FunctionComponent<GQLProps> = ({ active }) => {
  return active ? (
    <Consumer>
      {({ api, state }: Combo) => {
        const story = state.storiesHash[state.storyId];
        const parameters = story ? api.getParameters(story.id, PARAM_KEY) : null;

        if (parameters) {
          const query = reIndentQuery(parameters.query);
          const variables = parameters.variables || '{}';
          const url = parameters.url || '';
          const fetcher = parameters.fetcher || getDefaultFetcher(url);

          return <GraphiQL query={query} variables={variables} fetcher={fetcher} />;
        }
        return <div>You have not configured GraphiQL yet</div>;
      }}
    </Consumer>
  ) : null;
};
GQL.propTypes = {
  active: PropTypes.bool.isRequired,
};

export default GQL;
