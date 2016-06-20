import React from 'react';
import PropVal from './PropVal';

const stylesheet = {
  propStyle: {
    paddingLeft: 8,
  },
  propNameStyle: {

  },
  propValueStyle: {

  }
}

export default class Props extends React.Component {
  render() {
    const props = this.props.node.props;
    const defaultProps = this.props.node.type.defaultProps;
    if (!props || typeof props !== 'object') {
      return <span/>;
    }

    const {propStyle, propValueStyle, propNameStyle} = stylesheet;

    const names = Object.keys(props).filter(name => {
      return name[0] !== '_' && name !== 'children' && (!defaultProps || props[name] != defaultProps[name]);
    });

    const items = [];
    names.slice(0, 3).forEach(name => {
      items.push(
        <span style={propStyle}>
          <span style={propNameStyle}>{name}</span>
          =
          <span style={propValueStyle}><PropVal val={props[name]} /></span>
        </span>
      );
    });

    return <span>{items}</span>
  }
}
