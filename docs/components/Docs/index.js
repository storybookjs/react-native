import PropTypes from 'prop-types';
import React from 'react';
import Helmet from 'react-helmet';
import Header from '../Header';
import Container from './Container';
import Footer from '../Footer';
import './style.css';

class Docs extends React.Component {
  render() {
    const { sections, selectedItem, selectedSectionId, selectedItemId } = this.props;

    const headTitle = `${selectedItem.title}`;

    return (
      <div className="container">
        <Helmet title={headTitle} />
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
  }
}

Docs.propTypes = {
  sections: PropTypes.array,
  selectedItem: PropTypes.object,
  selectedSectionId: PropTypes.string,
  selectedItemId: PropTypes.string,
};

export default Docs;
