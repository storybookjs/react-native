import LeftPanel from '../components/left_panel';
import { useDeps, composeAll } from 'mantra-core';
import * as filters from '../libs/filters';
import reduxComposer from '../libs/redux_composer';

export const composer = ({ api, ui }, { actions }) => {
  const actionMap = actions();
  const { stories, selectedKind, selectedStory, options } = api;
  const { storyFilter } = ui;

  const data = {
    stories: filters.storyFilter(stories, storyFilter, selectedKind, selectedStory),
    selectedKind,
    selectedStory,
    onSelectStory: actionMap.api.selectStory,

    storyFilter,
    onStoryFilter: actionMap.ui.setStoryFilter,

    openShortcutsHelp: actionMap.ui.toggleShortcutsHelp,
    name: options.name,
    url: options.url,
  };

  return data;
};

export default composeAll(
  reduxComposer(composer),
  useDeps()
)(LeftPanel);
