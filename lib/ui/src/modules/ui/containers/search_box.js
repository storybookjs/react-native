import React from 'react';
import SearchBoxComponent from '../components/search_box';

import { Consumer } from '../../../state';

export const mapper = state => ({
  showSearchBox: state.shortcutOptions.showSearchBox,
  stories: state.stories,
  onSelectStory: (...args) => {
    console.log('onSelectStory', args);
  },
  onClose() {
    console.log('searchbox.onClose');
    // actionMap.shortcuts.setOptions({
    //   showSearchBox: false,
    // });
  },
});

export default props => (
  <Consumer>
    {state => {
      const finalProps = {
        ...props,
        ...mapper(state),
      };

      return <SearchBoxComponent {...finalProps} />;
    }}
  </Consumer>
);
