import React from 'react';
import PropTypes from 'prop-types';
import PropVal from './PropVal';

const stylesheet = {
  propStyle: {},
  propNameStyle: {},
  propValueStyle: {},
};

export default function Props(props) {
  const { maxPropsIntoLine, maxPropArrayLength, maxPropObjectKeys, maxPropStringLength } = props;
  const nodeProps = props.node.props;
  const defaultProps = props.node.type.defaultProps;
  if (!nodeProps || typeof nodeProps !== 'object') {
    return <span />;
  }

  const { propValueStyle, propNameStyle } = stylesheet;

  const names = Object.keys(nodeProps).filter(
    name =>
      name[0] !== '_' &&
      name !== 'children' &&
      (!defaultProps || nodeProps[name] !== defaultProps[name])
  );

  const breakIntoNewLines = names.length > maxPropsIntoLine;
  const endingSpace = props.singleLine ? ' ' : '';

  const items = [];
  names.forEach((name, i) => {
    items.push(
      <span key={name}>
        {breakIntoNewLines
          ? <span>
              <br />&nbsp;&nbsp;
            </span>
          : ' '}
        <span style={propNameStyle}>
          {name}
        </span>
        {/* Use implicit true: */}
        {(!nodeProps[name] || typeof nodeProps[name] !== 'boolean') &&
          <span>
            =
            <span style={propValueStyle}>
              <PropVal
                val={nodeProps[name]}
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

  return (
    <span>
      {items}
    </span>
  );
}

Props.defaultProps = {
  singleLine: false,
};

Props.propTypes = {
  node: PropTypes.node.isRequired,
  singleLine: PropTypes.bool,
  maxPropsIntoLine: PropTypes.number.isRequired,
  maxPropObjectKeys: PropTypes.number.isRequired,
  maxPropArrayLength: PropTypes.number.isRequired,
  maxPropStringLength: PropTypes.number.isRequired,
};
