import { PREVIEW_URL } from 'global';
import React from 'react';

import { Consumer } from '@storybook/api';

import { Preview } from '../components/preview/preview';

const nonAlphanumSpace = /[^a-z0-9 ]/gi;
const doubleSpace = /\s\s/gi;
const replacer = match => ` ${match} `;
const addExtraWhiteSpace = input =>
  input.replace(nonAlphanumSpace, replacer).replace(doubleSpace, ' ');

const mapper = ({ api, state: { layout, location, selected, customQueryParams } }) => ({
  api,
  getElements: api.getElements,
  options: layout,
  description: selected ? addExtraWhiteSpace(`${selected.kind} - ${selected.name}`) : '',
  ...api.getUrlState(),
  queryParams: customQueryParams,
  location,
});

function getBaseUrl() {
  try {
    return PREVIEW_URL || 'iframe.html';
  } catch (e) {
    return 'iframe.html';
  }
}

const PreviewConnected = React.memo(props => (
  <Consumer filter={mapper}>
    {fromState => {
      return (
        <Preview
          {...props}
          baseUrl={getBaseUrl()}
          {...fromState}
          customCanvas={fromState.api.renderPreview}
        />
      );
    }}
  </Consumer>
));
PreviewConnected.displayName = 'PreviewConnected';

export default PreviewConnected;
