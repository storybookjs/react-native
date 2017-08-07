import { decorators } from 'react-treebeard';
import { IoChevronRight } from 'react-icons/lib/io';
import React from 'react';
import PropTypes from 'prop-types';

function ToggleDecorator({ style }) {
  const { height, width, arrow } = style;

  return (
    <div style={style.base}>
      <div style={style.wrapper}>
        <IoChevronRight height={height} width={width} style={arrow} />
      </div>
    </div>
  );
}

ToggleDecorator.propTypes = {
  style: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    arrow: PropTypes.object.isRequired,
  }).isRequired,
};

function ContainerDecorator(props) {
  const { node } = props;

  if (node.root) {
    return null;
  }

  return <decorators.Container {...props} />;
}

ContainerDecorator.propTypes = {
  node: PropTypes.shape({
    root: PropTypes.bool,
  }).isRequired,
};

function createHeaderDecoratorScope(parent) {
  class HeaderDecorator extends React.Component {
    constructor(...args) {
      super(...args);
      this.onKeyDown = this.onKeyDown.bind(this);
    }

    onKeyDown(event) {
      const { onKeyDown } = parent;
      const { node } = this.props;

      onKeyDown(event, node);
    }

    render() {
      const { style, node } = this.props;

      const newStyleTitle = {
        ...style.title,
      };

      if (!node.children || !node.children.length) {
        newStyleTitle.fontSize = '13px';
      }

      return (
        <div style={style.base} role="menuitem" tabIndex="0" onKeyDown={this.onKeyDown}>
          <a style={newStyleTitle}>
            {node.name}
          </a>
        </div>
      );
    }
  }

  HeaderDecorator.propTypes = {
    style: PropTypes.shape({
      title: PropTypes.object.isRequired,
      base: PropTypes.object.isRequired,
    }).isRequired,
    node: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  };

  return HeaderDecorator;
}

export default function(parent) {
  return {
    ...decorators,
    Header: createHeaderDecoratorScope(parent),
    Container: ContainerDecorator,
    Toggle: ToggleDecorator,
  };
}
