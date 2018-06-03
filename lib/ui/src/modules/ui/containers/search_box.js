import SearchBoxComponent from '../components/search_box';
import genPoddaLoader from '../libs/gen_podda_loader';
import compose from '../../../compose';

export const mapper = (state, props, { actions }) => {
  const actionMap = actions();
  return {
    showSearchBox: state.shortcutOptions.showSearchBox,
    stories: state.stories,
    onSelectStory: actionMap.api.selectStory,
    onClose() {
      actionMap.shortcuts.setOptions({
        showSearchBox: false,
      });
    },
  };
};

export default compose(
  genPoddaLoader(mapper),
  { withRef: false }
)(SearchBoxComponent);
