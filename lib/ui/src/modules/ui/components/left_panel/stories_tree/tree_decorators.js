import { decorators } from 'react-treebeard';
import IoChevronRight from 'react-icons/lib/io/chevron-right';
import React from 'react';
import PropTypes from 'prop-types';
import { MenuLink } from '../../../containers/routed_link';
import MenuItem from '../../menu_item';
import treeNodeTypes from './tree_node_type';
import { highlightNode } from './tree_decorators_utils';

function noop() {}

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
  const { node, style, onClick } = props;
  const { container, ...restStyles } = style;

  if (node.root) {
    return null;
  }

  const containerStyle = container.reduce((acc, styles) => ({ ...acc, ...styles }), {});
  const innerContainer = <decorators.Container {...props} style={restStyles} onClick={noop} />;

  if (node.type !== treeNodeTypes.STORY) {
    return (
      <MenuItem style={containerStyle} onClick={onClick} data-name={node.name}>
        {innerContainer}
      </MenuItem>
    );
  }

  const overrideParams = {
    selectedKind: node.kind,
    selectedStory: node.story,
  };

  return (
    <MenuLink
      active={node.active}
      overrideParams={overrideParams}
      onClick={onClick}
      data-name={node.name}
    >
      {innerContainer}
    </MenuLink>
  );
}

ContainerDecorator.propTypes = {
  style: PropTypes.shape({
    container: PropTypes.array.isRequired,
  }).isRequired,
  node: PropTypes.shape({
    root: PropTypes.bool,
    type: PropTypes.oneOf([treeNodeTypes.NAMESPACE, treeNodeTypes.COMPONENT, treeNodeTypes.STORY])
      .isRequired,
    name: PropTypes.string.isRequired,
    kind: PropTypes.string,
    story: PropTypes.string,
    active: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

function HeaderDecorator(props) {
  const { style, node, ...restProps } = props;

  let newStyle = style;

  if (node.type === treeNodeTypes.STORY) {
    newStyle = {
      ...style,
      title: null,
    };
  }

  const name = highlightNode(node, style);

  const newNode = {
    ...node,
    name,
  };

  return <decorators.Header style={newStyle} node={newNode} {...restProps} />;
}

HeaderDecorator.propTypes = {
  style: PropTypes.shape({
    title: PropTypes.object.isRequired,
    base: PropTypes.object.isRequired,
  }).isRequired,
  node: PropTypes.shape({
    type: PropTypes.oneOf([treeNodeTypes.NAMESPACE, treeNodeTypes.COMPONENT, treeNodeTypes.STORY]),
    highlight: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  }).isRequired,
};

export default {
  ...decorators,
  Header: HeaderDecorator,
  Container: ContainerDecorator,
  Toggle: ToggleDecorator,
};
