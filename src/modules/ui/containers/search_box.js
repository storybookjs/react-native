import SearchBox from '../components/search_box';
import genReduxLoader from '../libs/gen_redux_loader';
import compose from '../../../compose';

export const mapper = ({ api, shortcuts }, props, { actions }) => {
  const actionMap = actions();
  return {
    showSearchBox: shortcuts.showSearchBox,
    stories: api.stories,
    onSelectStory: actionMap.api.selectStory,
    handleEvent: actionMap.shortcuts.handleEvent,
  };
};

export default compose(genReduxLoader(mapper))(SearchBox);
