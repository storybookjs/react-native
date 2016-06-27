import SearchBox from '../components/search_box';
import { useDeps, composeAll } from 'mantra-core';
import reduxComposer from '../libs/redux_composer';

export const composer = ({ api, shortcuts }, { actions }) => {
  const actionMap = actions();
  return {
    showSearchBox: shortcuts.showSearchBox,
    stories: api.stories,
    onSelectStory: actionMap.api.selectStory,
    handleEvent: actionMap.shortcuts.handleEvent,
  };
};

export default composeAll(
  reduxComposer(composer),
  useDeps()
)(SearchBox);
