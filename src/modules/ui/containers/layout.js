import Layout from '../components/layout';
import { useDeps, composeAll } from 'mantra-core';
import pick from 'lodash.pick';
import reduxComposer from '../libs/redux_composer';

export const composer = ({ shortcuts, api }, { actions }) => {
  const actionMap = actions();
  const propShortCuts = pick(shortcuts, 'showLeftPanel', 'showDownPanel', 'goFullScreen', 'showSearchBox');
  return {
    ...propShortCuts,
    stories: api.stories,
    actions: actionMap
  };
};

export default composeAll(
  reduxComposer(composer),
  useDeps()
)(Layout);
