import PropTypes from 'prop-types';
import React from 'react';
import Helmet from 'react-helmet';
import Header from '../Homepage/Header';
import Container from './Container';
import Footer from '../Homepage/Footer';
import './style.css';

class Docs extends React.Component {
  render() {
    const {
      categories,
      selectedCatId,
      sections,
      selectedItem,
      selectedSectionId,
      selectedItemId,
    } = this.props;

    const selectedCat = categories.find(cat => cat.id === selectedCatId);
    const headTitle = `${selectedItem.title} - ${selectedCat.title}`;

    return (
      <div className="container">
        <Helmet title={headTitle} />
        <Header currentSection="docs" />
        <Container
          categories={categories}
          selectedCatId={selectedCatId}
          sections={sections}
          selectedItem={selectedItem}
          selectedSectionId={selectedSectionId}
          selectedItemId={selectedItemId}
        />
        <Footer />
      </div>
    );
  }
}

Docs.propTypes = {
  categories: PropTypes.array,
  selectedCatId: PropTypes.string,
  sections: PropTypes.array,
  selectedItem: PropTypes.object,
  selectedSectionId: PropTypes.string,
  selectedItemId: PropTypes.string,
};

export default Docs;
