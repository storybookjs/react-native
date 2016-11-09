import LeftPanel from '../components/left_panel';
import * as filters from '../libs/filters';
import genReduxLoader from '../libs/gen_redux_loader';
import compose from '../../../compose';

export const mapper = ({ api, ui }, props, { actions }) => {
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

export default compose(genReduxLoader(mapper))(LeftPanel);
