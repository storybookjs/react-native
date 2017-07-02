import { decorators } from 'storybook-react-treebeard';
import { IoFolder, IoDocumentText, IoCode } from 'react-icons/lib/io';
import React from 'react';
import PropTypes from 'prop-types';
import treeNodeTypes from './tree_node_type';

const iconsColor = '#7d8890';

const iconsMap = {
  [treeNodeTypes.NAMESPACE]: IoFolder,
  [treeNodeTypes.COMPONENT]: IoDocumentText,
  [treeNodeTypes.STORY]: IoCode,
};

function ContainerDecorator(props) {
  const { node, style } = props;

  if (node.root) {
    style.subtree.paddingLeft = '0';
    return null;
  }

  style.subtree.paddingLeft = '19px';

  return <decorators.Container {...props} />;
}

ContainerDecorator.propTypes = {
  style: PropTypes.shape({
    subtree: PropTypes.object,
  }).isRequired,
  node: PropTypes.shape({
    root: PropTypes.bool,
  }).isRequired,
};

function HeaderDecorator(props) {
  const { style, node } = props;

  const newStyleTitle = {
    ...style.title,
  };

  const Icon = iconsMap[node.type];

  if (!node.children || !node.children.length) {
    newStyleTitle.fontSize = '13px';
  }

  return (
    <div style={style.base}>
      {Icon && <Icon color={iconsColor} />}
      <a style={newStyleTitle}>
        {node.name}
      </a>
    </div>
  );
}

HeaderDecorator.propTypes = {
  style: PropTypes.shape({
    title: PropTypes.object,
    base: PropTypes.object,
  }).isRequired,
  node: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

export default {
  ...decorators,
  Header: HeaderDecorator,
  Container: ContainerDecorator,
};
