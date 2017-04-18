import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles';
import { Link } from 'react-router';

class Navigation extends React.Component {
  renderHeading(caption) {
    const style = {
      ...styles.h3,
    };

    return <h3 style={style}>{caption}</h3>;
  }

  renderItem(section, item) {
    const { prefix = '', selectedSection, selectedItem } = this.props;
    const href = `${prefix}/docs/${section.id}/${item.id}`;

    let style = styles.item;
    if (selectedSection === section.id && selectedItem === item.id) {
      style = styles.selectedItem;
    }

    return (
      <Link style={style} to={href}>
        {item.title}
      </Link>
    );
  }

  render() {
    const { sections } = this.props;
    return (
      <div style={styles.container}>
        {sections.map(section => (
          <div key={section.heading}>
            {this.renderHeading(section.heading)}
            <ul style={styles.ul}>
              {section.items.map(item => (
                <li key={`${section.heading}:${item.title}`} style={styles.li}>
                  {this.renderItem(section, item)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}

Navigation.propTypes = {
  sections: PropTypes.array,
  selectedSection: PropTypes.string,
  selectedItem: PropTypes.string,
  prefix: PropTypes.string,
};

export default Navigation;
