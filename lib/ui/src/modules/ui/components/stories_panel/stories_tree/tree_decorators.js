import { decorators } from 'react-treebeard';
import { Icons } from '@storybook/components';
import React from 'react';
import PropTypes from 'prop-types';
import { withCSSContext } from '@emotion/core';
import { MenuLink } from '../../../containers/routed_link';
import MenuItem from '../../menu_item';
import treeNodeTypes from './tree_node_type';
import { highlightNode } from './tree_decorators_utils';

function noop() {}

function ToggleDecorator({ style, theme }) {
  const { height, width, arrow } = style;
  const { treeArrow } = theme;

  const baseStyles =
    treeArrow && treeArrow.base ? { ...style.base, ...treeArrow.base } : style.base;
  const wrapperStyles =
    treeArrow && treeArrow.wrapper ? { ...style.wrapper, ...treeArrow.wrapper } : style.wrapper;
  const chevronHeight = treeArrow && treeArrow.height ? treeArrow.height : height;
  const chevronWeight = treeArrow && treeArrow.width ? treeArrow.height : width;
  const arrowStyles = treeArrow && treeArrow.arrow ? { ...arrow, ...treeArrow.arrow } : arrow;

  return (
    <div style={baseStyles}>
      <div style={wrapperStyles}>
        <Icons.ChevronRight height={chevronHeight} width={chevronWeight} style={arrowStyles} />
      </div>
    </div>
  );
}

ToggleDecorator.propTypes = {
  theme: PropTypes.shape({}),
  style: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    arrow: PropTypes.object.isRequired,
  }).isRequired,
};

ToggleDecorator.defaultProps = {
  theme: {},
};

function ContainerDecorator(props) {
  const { node, style, onClick, theme } = props;
  const { container, ...restStyles } = style;

  if (node.root) {
    return null;
  }

  const containerStyle = container.reduce((acc, styles) => ({ ...acc, ...styles }), {});
  const innerContainer = <decorators.Container {...props} style={restStyles} onClick={noop} />;

  const containerStyles = { ...containerStyle, ...theme.treeMenuHeader };

  if (node.type !== treeNodeTypes.STORY) {
    return (
      <MenuItem style={containerStyles} onClick={onClick} data-name={node.name}>
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
      active={node.active || undefined}
      overrideParams={overrideParams}
      onClick={onClick}
      data-name={node.name}
    >
      {innerContainer}
    </MenuLink>
  );
}

ContainerDecorator.propTypes = {
  theme: PropTypes.shape({}),
  style: PropTypes.shape({
    container: PropTypes.array.isRequired,
  }).isRequired,
  node: PropTypes.shape({
    root: PropTypes.bool,
    type: PropTypes.oneOf([treeNodeTypes.NAMESPACE, treeNodeTypes.STORY]).isRequired,
    name: PropTypes.string.isRequired,
    kind: PropTypes.string,
    story: PropTypes.string,
    active: PropTypes.bool,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

ContainerDecorator.defaultProps = {
  theme: {},
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
    type: PropTypes.oneOf([treeNodeTypes.NAMESPACE, treeNodeTypes.STORY]),
    highlight: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  }).isRequired,
};

export default {
  ...decorators,
  Header: HeaderDecorator,
  Container: withCSSContext((props, { theme }) => <ContainerDecorator {...props} theme={theme} />),
  Toggle: withCSSContext((props, { theme }) => <ToggleDecorator {...props} theme={theme} />),
};
