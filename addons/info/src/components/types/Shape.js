import PropTypes from 'prop-types';
import React from 'react';

import { HighlightButton } from '@storybook/components';
import PrettyPropType from './PrettyPropType';
import PropertyLabel from './PropertyLabel';

import { TypeInfo, getPropTypes } from './proptypes';

const MARGIN_SIZE = 15;

class Shape extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      minimized: false,
    };
  }

  handleToggle = () => {
    this.setState({
      minimized: !this.state.minimized,
    });
  };

  handleMouseEnter = () => {
    this.setState({ hover: true });
  };

  handleMouseLeave = () => {
    this.setState({ hover: false });
  };

  render() {
    const { propType, depth } = this.props;
    const propTypes = getPropTypes(propType);
    return (
      <span>
        <HighlightButton
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          highlight={this.state.hover}
          onClick={this.handleToggle}
        >
          {'{'}
        </HighlightButton>
        <HighlightButton onClick={this.handleToggle}>...</HighlightButton>
        {!this.state.minimized &&
          Object.keys(propTypes).map(childProperty => (
            <div key={childProperty} style={{ marginLeft: depth * MARGIN_SIZE }}>
              <PropertyLabel
                property={childProperty}
                required={propTypes[childProperty].required}
              />
              <PrettyPropType depth={depth + 1} propType={propTypes[childProperty]} />
              ,
            </div>
          ))}

        <HighlightButton
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          highlight={this.state.hover}
          onClick={this.handleToggle}
        >
          {'}'}
        </HighlightButton>
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
