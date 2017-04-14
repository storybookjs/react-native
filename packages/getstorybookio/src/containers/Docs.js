import React from 'react';
import Docs from '../components/Docs';
import {
  getCategories,
  getNavigationData,
  getItem,
  getFirstItem,
  getFirstItemOfSection,
} from '../docs';

class DocsContainer extends React.Component {
  render() {
    const { catId, sectionId, itemId } = this.props.params;

    let selectedItem;
    const selectedCatId = catId || getCategories()[0].id;

    if (!sectionId) {
      selectedItem = getFirstItem(selectedCatId);
    } else if (!itemId) {
      selectedItem = getFirstItemOfSection(selectedCatId, sectionId);
    } else {
      selectedItem = getItem(selectedCatId, sectionId, itemId);
    }

    const selectedSectionId = sectionId || 'basics';
    const selectedItemId = selectedItem.id;

    const props = {
      categories: getCategories(),
      selectedCatId,
      sections: getNavigationData(selectedCatId),
      selectedItem,
      selectedSectionId,
      selectedItemId,
    };

    return <Docs {...props} />;
  }
}

export default DocsContainer;
