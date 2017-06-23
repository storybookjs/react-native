import LeftPanel from '../components/left_panel';
import * as filters from '../libs/filters';
import genPoddaLoader from '../libs/gen_podda_loader';
import compose from '../../../compose';
import createHierarchy from '../libs/hierarchy';

export const mapper = (state, props, { actions }) => {
  const actionMap = actions();
  const { stories, selectedKind, selectedStory, uiOptions, storyFilter } = state;
  const { name, url, sortStoriesByKind, leftPanelHierarchy } = uiOptions;
  const filteredStores = filters.storyFilter(stories, storyFilter, selectedKind, sortStoriesByKind);
  const storiesHierarchy = leftPanelHierarchy ? createHierarchy(filteredStores) : null;

  const data = {
    stories: filteredStores,
    storiesHierarchy,
    selectedKind,
    selectedStory,
    onSelectStory: actionMap.api.selectStory,

    storyFilter,
    onStoryFilter: actionMap.ui.setStoryFilter,

    openShortcutsHelp: actionMap.ui.toggleShortcutsHelp,
    name,
    url,
    leftPanelHierarchy,
  };

  return data;
};

export default compose(genPoddaLoader(mapper))(LeftPanel);
