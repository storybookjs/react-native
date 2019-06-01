import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import GraphiQL from 'graphiql';
import 'graphiql/graphiql.css';

import { Consumer, Combo } from '@storybook/api';

import { PARAM_KEY } from '.';
import { reIndentQuery, getDefaultFetcher } from './shared';

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
