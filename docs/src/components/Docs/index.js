import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

// import Header from '../Header';
import Header from '../../new-components/layout/Header';
import Container from './Container';
import Footer from '../Footer';
import './style.css';

const Docs = ({ sections, selectedItem, selectedSectionId, selectedItemId }) => (
  <div className="container">
    <Helmet title={`${selectedItem.title}`} />
    <Header currentSection="docs" />
    <Container
      sections={sections}
      selectedItem={selectedItem}
      selectedSectionId={selectedSectionId}
      selectedItemId={selectedItemId}
    />
    <Footer />
  </div>
);
Docs.propTypes = {
  sections: PropTypes.array, // eslint-disable-line
  selectedItem: PropTypes.object, // eslint-disable-line
  selectedSectionId: PropTypes.string.isRequired,
  selectedItemId: PropTypes.string.isRequired,
};

export default Docs;
