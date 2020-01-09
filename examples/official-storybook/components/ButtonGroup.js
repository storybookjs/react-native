import React from 'react';
import PropTypes from 'prop-types';

/** ButtonGroup component description from docgen */
export const ButtonGroup = ({ background, children }) => (
  <div style={{ background }}>{children}</div>
);

ButtonGroup.defaultProps = {
  background: '#ff0',
  children: null,
};

ButtonGroup.propTypes = {
  /**
   * Background color for the group
   */
  background: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element),
};

/** SubGroup component description from docgen */
export const SubGroup = ({ background, children }) => <div style={{ background }}>{children}</div>;

SubGroup.defaultProps = {
  background: '#0f0',
  children: null,
};

SubGroup.propTypes = {
  /**
   * Background color for the sub-group
   */
  background: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element),
};
