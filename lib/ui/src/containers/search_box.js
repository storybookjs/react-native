import { inject } from 'mobx-react';

import SearchBoxComponent from '../components/search_box';

export const mapper = store => ({
  showSearchBox: store.shortcutOptions.showSearchBox,
  stories: store.stories,
  onSelectStory: (kind, story) => store.selectStory(kind, story),
  onClose: () => store.toggleSearchBox(),
});

export default inject(({ store }) => mapper(store))(SearchBoxComponent);
