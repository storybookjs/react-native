import { inject } from 'mobx-react';
import { observe } from 'mobx';

import SearchBox from '../components/search_box';

export const mapper = store => {
  return {
    showSearchBox: store.shortcutOptions.showSearchBox,
    stories: store.stories,
    onSelectStory: (kind, story) => store.selectStory(kind, story),
    onClose: () => store.toggleSearchBox()
  };
};

export default inject(({ store }) => mapper(store))(SearchBox);
