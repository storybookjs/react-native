import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import './style.css';

const Nav = ({ sections, selectedSectionId, selectedItemId }) =>
  <div id="nav">
    {sections.map(section =>
      <div key={section.id}>
        <h3>
          {section.heading}
        </h3>
        <ul>
          {section.items.map(item => {
            const cssClass =
              section.id === selectedSectionId && item.id === selectedItemId ? 'selected' : '';

            const url = `/${section.id}/${item.id}/`;

            return (
              <li key={item.id}>
                <Link className={cssClass} to={url}>
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    )}
  </div>;
Nav.propTypes = {
  sections: PropTypes.array, // eslint-disable-line
  selectedSectionId: PropTypes.string.isRequired,
  selectedItemId: PropTypes.string.isRequired,
};

export { Nav as default };
