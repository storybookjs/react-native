import React from 'react';
import memoize from 'memoizerific';

import { Consumer } from '../core/context';
import { Preview } from '../components/preview/preview';

const nonAlphanumSpace = /[^a-z0-9 ]/gi;
const doubleSpace = /\s\s/gi;
const replacer = match => ` ${match} `;
const addExtraWhiteSpace = input =>
  input.replace(nonAlphanumSpace, replacer).replace(doubleSpace, ' ');

const createPreviewActions = memoize(1)(api => ({
  toggleFullscreen: () => api.toggleFullscreen(),
}));
const createProps = (api, layout, location, path, storyId, viewMode, selected) => ({
  api,
  getElements: api.getElements,
  actions: createPreviewActions(api),
  options: layout,
  location,
  path,
  storyId,
  viewMode,
  description: selected ? addExtraWhiteSpace(`${selected.kind} - ${selected.name}`) : '',
});

const PreviewConnected = React.memo(props => (
  <Consumer>
    {({ state, api }) =>
      api.renderPreview ? (
        api.renderPreview(state, api)
      ) : (
        <Preview
          {...props}
          {...createProps(
            api,
            state.layout,
            state.location,
            state.path,
            state.storyId,
            state.viewMode,
            state.storiesHash[state.storyId]
          )}
        />
      )
    }
  </Consumer>
));
PreviewConnected.displayName = 'PreviewConnected';

export default PreviewConnected;
