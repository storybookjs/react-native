import PropTypes from 'prop-types';
import React from 'react';

import PrettyPropType from './PrettyPropType';
import PropertyLabel from './PropertyLabel';
import HighlightButton from './HighlightButton';

import { TypeInfo } from './proptypes';

const MARGIN_SIZE = 15;

export default class ObjectType extends React.Component {
  static propTypes = {
    propType: TypeInfo,
    depth: PropTypes.number.isRequired,
  };

  static defaultProps = {
    propType: null,
  };

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
          Object.keys(propType.value).map(childProperty =>
            <div key={childProperty} style={{ marginLeft: depth * MARGIN_SIZE }}>
              <PropertyLabel
                property={childProperty}
                required={propType.value[childProperty].required}
              />
              <PrettyPropType depth={depth + 1} propType={propType.value[childProperty]} />
              ,
            </div>
          )}

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
