import LeftPanel from '../components/left_panel';
import * as filters from '../libs/filters';
import genPoddaLoader from '../libs/gen_podda_loader';
import compose from '../../../compose';
import { createHierarchy, resolveStoryHierarchy } from '../libs/hierarchy';

export const mapper = (state, props, { actions }) => {
  const actionMap = actions();
  const { stories, selectedKind, selectedStory, uiOptions, storyFilter } = state;
  const { name, url, sortStoriesByKind, hierarchySeparator } = uiOptions;
  const filteredStories = filters.storyFilter(
    stories,
    storyFilter,
    selectedKind,
    sortStoriesByKind
  );

  const storiesHierarchy = createHierarchy(filteredStories, hierarchySeparator);
  const selectedHierarchy = resolveStoryHierarchy(selectedKind, hierarchySeparator);

  const data = {
    storiesHierarchy,
    selectedKind,
    selectedStory,
    selectedHierarchy,
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
