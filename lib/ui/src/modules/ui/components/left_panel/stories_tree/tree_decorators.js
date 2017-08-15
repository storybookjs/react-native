import { decorators } from 'react-treebeard';
import IoChevronRight from 'react-icons/lib/io/chevron-right';
import React from 'react';
import PropTypes from 'prop-types';
import RoutedLink from '../../../containers/routed_link';
import MenuItem from '../../menu_item';
import treeNodeTypes from './tree_node_type';

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

  let containerStyle = container.reduce((acc, styles) => ({ ...acc, ...styles }), {});
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

  containerStyle = {
    ...style.nativeLink,
    ...containerStyle,
  };

  return (
    <RoutedLink
      overrideParams={overrideParams}
      style={containerStyle}
      onClick={onClick}
      data-name={node.name}
    >
      {innerContainer}
    </RoutedLink>
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
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

class HeaderDecorator extends React.Component {
  decorateNameMatchedToSearchTerm(node, style) {
    const { storyFilter, name } = node;

    if (!storyFilter) {
      return name;
    }

    const nameParts = name.split(storyFilter);

    return nameParts.filter(part => part).map((part, index) => {
      const key = `${part}-${index}`;

      if (!storyFilter.test(part)) {
        return (
          <span key={key}>
            {part}
          </span>
        );
      }

      return (
        <strong key={key} style={style.highLightText}>
          {part}
        </strong>
      );
    });
  }

  render() {
    const { style, node, ...restProps } = this.props;

    let newStyle = style;

    if (node.type === treeNodeTypes.STORY) {
      newStyle = {
        ...style,
        title: {
          ...style.title,
          ...style.storyTitle,
        },
      };
    }

    const name = this.decorateNameMatchedToSearchTerm(node, style);

    const newNode = {
      ...node,
      name,
    };

    return <decorators.Header style={newStyle} node={newNode} {...restProps} />;
  }
}

HeaderDecorator.propTypes = {
  style: PropTypes.shape({
    title: PropTypes.object.isRequired,
    base: PropTypes.object.isRequired,
  }).isRequired,
  node: PropTypes.shape({
    type: PropTypes.oneOf([treeNodeTypes.NAMESPACE, treeNodeTypes.COMPONENT, treeNodeTypes.STORY]),
    storyFilter: PropTypes.instanceOf(RegExp),
  }).isRequired,
};

export default {
  ...decorators,
  Header: HeaderDecorator,
  Container: ContainerDecorator,
  Toggle: ToggleDecorator,
};
