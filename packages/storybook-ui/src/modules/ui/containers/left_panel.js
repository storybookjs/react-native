import LeftPanel from '../components/left_panel';
import * as filters from '../libs/filters';
import genPoddaLoader from '../libs/gen_podda_loader';
import compose from '../../../compose';

export const mapper = (state, props, { actions }) => {
  const actionMap = actions();
  const { stories, selectedKind, selectedStory, uiOptions, storyFilter } = state;
  const { name, url, sortStoriesByKind } = uiOptions;

  const data = {
    stories: filters.storyFilter(stories, storyFilter, selectedKind, sortStoriesByKind),
    selectedKind,
    selectedStory,
    onSelectStory: actionMap.api.selectStory,

    storyFilter,
    onStoryFilter: actionMap.ui.setStoryFilter,

    openShortcutsHelp: actionMap.ui.toggleShortcutsHelp,
    name,
    url,
  };

  return data;
};

export default compose(genPoddaLoader(mapper))(LeftPanel);
