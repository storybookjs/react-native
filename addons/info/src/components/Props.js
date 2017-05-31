import React from 'react';
import PropTypes from 'prop-types';
import PropVal from './PropVal';

const stylesheet = {
  propStyle: {},
  propNameStyle: {},
  propValueStyle: {},
};

export default class Props extends React.Component {
  render() {
    const {
      maxPropsIntoLine,
      maxPropObjectKeys,
      maxPropArrayLength,
      maxPropStringLength,
    } = this.props;
    const props = this.props.node.props;
    const defaultProps = this.props.node.type.defaultProps;
    if (!props || typeof props !== 'object') {
      return <span />;
    }

    const { propStyle, propValueStyle, propNameStyle } = stylesheet;

    const names = Object.keys(props).filter(
      name =>
        name[0] !== '_' &&
        name !== 'children' &&
        (!defaultProps || props[name] != defaultProps[name])
    );

    const breakIntoNewLines = names.length > maxPropsIntoLine;
    const endingSpace = this.props.singleLine ? ' ' : '';

    const items = [];
    names.forEach((name, i) => {
      items.push(
        <span key={name}>
          {breakIntoNewLines
            ? <span>
                <br />&nbsp;&nbsp;
              </span>
            : ' '}
          <span style={propNameStyle}>{name}</span>
          {/* Use implicit true: */}
          {(!props[name] || typeof props[name] !== 'boolean') &&
            <span>
              =
              <span style={propValueStyle}>
                <PropVal
                  val={props[name]}
                  maxPropObjectKeys={maxPropObjectKeys}
                  maxPropArrayLength={maxPropArrayLength}
                  maxPropStringLength={maxPropStringLength}
                />
              </span>
            </span>}

          {i === names.length - 1 && (breakIntoNewLines ? <br /> : endingSpace)}
        </span>
      );
    });

    return <span>{items}</span>;
  }
}
