import React from 'react';
import Docs from '../components/Docs';
import { getNavigationData, getItem, getFirstItem, getFirstItemOfSection } from '../docs'

class DocsContainer extends React.Component {
  render() {
    const { sectionId, itemId } = this.props.params;
    let selectedItem;

    if (!sectionId) {
      selectedItem = getFirstItem();
    } else if (!itemId) {
      selectedItem = getFirstItemOfSection(sectionId);
    } else {
      selectedItem = getItem(sectionId, itemId);
    }

    const selectedSectionId = sectionId || 'basics';
    const selectedItemId = selectedItem.id;

    const props = {
      sections: getNavigationData(),
      selectedItem,
      selectedSectionId,
      selectedItemId,
    };

    return (<Docs {...props}/>);
  }
}

export default DocsContainer;
