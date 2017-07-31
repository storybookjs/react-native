import React, { Component, PropTypes } from 'react';

/**
 * Certain features are only available in later ReactNative version.
 *
 * This component polfyills the min/max width/height features of the StyleSheet.
 *
 * Example usage:
 * ```
 * <MinMaxViewPolyfill
 *   maxWidth={200}
 *   minWidth={100}
 *   maxHeight={200}
 *   minHeight={100}
 * >
 *   <AnyComponent />
 * </MinMaxViewPolyfill>
 */
class MinMaxViewPolyfill extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onLayout: PropTypes.func,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    minHeight: PropTypes.number,
    maxHeight: PropTypes.number,
  };

  static defaultProps = {
    onLayout: null,
    minWidth: null,
    maxWidth: null,
    minHeight: null,
    maxHeight: null,
  };

  constructor(...args) {
    super(...args);
    this.onLayout = this.onLayout.bind(this);
    this.state = {
      minMaxStyle: null,
    };
  }

  onLayout(e) {
    const { width, height } = e.nativeEvent.layout;

    const minMaxStyle = {};

    if (this.props.minWidth !== null) {
      minMaxStyle.width = Math.max(this.props.minWidth, width);
    }
    if (this.props.maxWidth !== null) {
      minMaxStyle.width = Math.min(this.props.maxWidth, width);
    }

    if (this.props.minHeight !== null) {
      minMaxStyle.height = Math.max(this.props.minHeight, height);
    }
    if (this.props.maxHeight !== null) {
      minMaxStyle.height = Math.min(this.props.maxHeight, height);
    }

    this.setState({ minMaxStyle });

    if (this.props.onLayout) {
      this.props.onLayout(e);
    }
  }

  render() {
    // Eslint ignored below as `style` is a tricky propType to define when a child is arbitrary.
    const { children, style, ...props } = this.props; // eslint-disable-line react/prop-types
    return React.cloneElement(React.Children.only(children), {
      ...props,
      onLayout: this.onLayout,
      style: [style, this.state.minMaxStyle],
    });
  }
}

export default MinMaxViewPolyfill;
