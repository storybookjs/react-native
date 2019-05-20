/* eslint-disable import/no-cycle */
import PropTypes from 'prop-types';
import React from 'react';

import PrettyPropType from './PrettyPropType';
import PropertyLabel from './PropertyLabel';

import { TypeInfo, getPropTypes } from './proptypes';

const MARGIN_SIZE = 15;

const HighlightButton = props => (
  <button
    type="button"
    {...props}
    style={{
      display: 'inline-block',
      background: 'none',
      border: '0 none',
      color: 'gray',
      cursor: 'pointer',
    }}
  />
);

class Shape extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minimized: false,
    };
  }

  handleToggle = () => {
    const { minimized } = this.state;
    this.setState({
      minimized: !minimized,
    });
  };

  render() {
    const { propType, depth } = this.props;
    const { minimized } = this.state;

    const propTypes = getPropTypes(propType);
    return (
      <span>
        <HighlightButton onClick={this.handleToggle}>{'{'}</HighlightButton>
        <HighlightButton onClick={this.handleToggle}>...</HighlightButton>
        {!minimized &&
          Object.keys(propTypes).map(childProperty => (
            <div key={childProperty} style={{ marginLeft: depth * MARGIN_SIZE }}>
              <PropertyLabel
                property={childProperty}
                required={propTypes[childProperty].required}
              />
              <PrettyPropType depth={depth + 1} propType={propTypes[childProperty]} />,
            </div>
          ))}

        <HighlightButton onClick={this.handleToggle}>{'}'}</HighlightButton>
      </span>
    );
  }
}

Shape.propTypes = {
  propType: TypeInfo,
  depth: PropTypes.number.isRequired,
};

Shape.defaultProps = {
  propType: null,
};

export default Shape;
