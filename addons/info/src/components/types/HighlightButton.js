import PropTypes from 'prop-types';
import React from 'react';

export default class HighlightButton extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    highlight: PropTypes.bool,
  };

  static defaultProps = {
    highlight: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  handleMouseEnter = () => {
    this.setState({ hover: true });
  };

  handleMouseLeave = () => {
    this.setState({ hover: false });
  };

  render() {
    const { children, highlight, ...otherProps } = this.props;
    const style =
      highlight || this.state.hover
        ? {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            border: '1px solid #ccc',
          }
        : {};
    return (
      <span
        role="button"
        tabIndex={-1}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        style={{
          ...style,
          ...{
            cursor: 'pointer',
          },
        }}
        {...otherProps}
      >
        {children}
      </span>
    );
  }
}
