import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import { Link } from '@storybook/router';
import { SyntaxHighlighter } from '@storybook/components';

import { createElement } from 'react-syntax-highlighter';
import { EVENT_ID } from './events';

const StyledStoryLink = styled(Link)(({ theme }) => ({
  display: 'block',
  textDecoration: 'none',
  borderRadius: theme.appBorderRadius,
  color: 'inherit',

  '&:hover': {
    background: theme.background.hoverable,
  },
}));

const SelectedStoryHighlight = styled.div(({ theme }) => ({
  background: theme.background.hoverable,
  borderRadius: theme.appBorderRadius,
}));

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)(({ theme }) => ({
  fontSize: theme.typography.size.s2 - 1,
}));

const areLocationsEqual = (a, b) =>
  a.startLoc.line === b.startLoc.line &&
  a.startLoc.col === b.startLoc.col &&
  a.endLoc.line === b.endLoc.line &&
  a.endLoc.col === b.endLoc.col;

const getLocationKeys = locationsMap =>
  locationsMap
    ? Array.from(Object.keys(locationsMap)).sort(
        (key1, key2) => locationsMap[key1].startLoc.line - locationsMap[key2].startLoc.line
      )
    : [];

export default class StoryPanel extends Component {
  state = { source: 'loading source...' };

  componentDidMount() {
    this.mounted = true;
    const { api } = this.props;

    api.on(EVENT_ID, this.listener);
  }

  componentDidUpdate() {
    if (this.selectedStoryRef) {
      this.selectedStoryRef.scrollIntoView();
    }
  }

  componentWillUnmount() {
    const { api } = this.props;

    api.off(EVENT_ID, this.listener);
  }

  setSelectedStoryRef = ref => {
    this.selectedStoryRef = ref;
  };

  listener = ({ source, currentLocation, locationsMap }) => {
    const locationsKeys = getLocationKeys(locationsMap);

    this.setState({
      source,
      currentLocation,
      locationsMap,
      locationsKeys,
    });
  };

  createPart = (rows, stylesheet, useInlineStyles) =>
    rows.map((node, i) =>
      createElement({
        node,
        stylesheet,
        useInlineStyles,
        key: `code-segement${i}`,
      })
    );

  createStoryPart = (rows, stylesheet, useInlineStyles, location, id) => {
    const { currentLocation } = this.state;
    const first = location.startLoc.line - 1;
    const last = location.endLoc.line;

    const storyRows = rows.slice(first, last);
    const story = this.createPart(storyRows, stylesheet, useInlineStyles);
    const storyKey = `${first}-${last}`;

    if (location && currentLocation && areLocationsEqual(location, currentLocation)) {
      return (
        <SelectedStoryHighlight key={storyKey} ref={this.setSelectedStoryRef}>
          {story}
        </SelectedStoryHighlight>
      );
    }

    return (
      <StyledStoryLink to={`/story/${id}`} key={storyKey}>
        {story}
      </StyledStoryLink>
    );
  };

  createParts = (rows, stylesheet, useInlineStyles) => {
    const { locationsMap, locationsKeys } = this.state;

    const parts = [];
    let lastRow = 0;

    locationsKeys.forEach(key => {
      const location = locationsMap[key];
      const first = location.startLoc.line - 1;
      const last = location.endLoc.line;

      const start = this.createPart(rows.slice(lastRow, first), stylesheet, useInlineStyles);
      const storyPart = this.createStoryPart(rows, stylesheet, useInlineStyles, location, key);

      parts.push(start);
      parts.push(storyPart);

      lastRow = last;
    });

    const lastPart = this.createPart(rows.slice(lastRow), stylesheet, useInlineStyles);

    parts.push(lastPart);

    return parts;
  };

  lineRenderer = ({ rows, stylesheet, useInlineStyles }) => {
    const { locationsMap, locationsKeys } = this.state;

    // because of the usage of lineRenderer, all lines will be wrapped in a span
    // these spans will recieve all classes on them for some reason
    // which makes colours casecade incorrectly
    // this removed that list of classnames
    const myrows = rows.map(({ properties, ...rest }) => ({
      ...rest,
      properties: { className: [] },
    }));

    if (!locationsMap || !locationsKeys.length) {
      return this.createPart(myrows, stylesheet, useInlineStyles);
    }

    const parts = this.createParts(myrows, stylesheet, useInlineStyles);

    return <span>{parts}</span>;
  };

  render() {
    const { active } = this.props;
    const { source } = this.state;

    return active ? (
      <StyledSyntaxHighlighter
        language="jsx"
        showLineNumbers="true"
        renderer={this.lineRenderer}
        format={false}
        copyable={false}
        padded
      >
        {source}
      </StyledSyntaxHighlighter>
    ) : null;
  }
}

StoryPanel.propTypes = {
  active: PropTypes.bool.isRequired,
  api: PropTypes.shape({
    selectStory: PropTypes.func.isRequired,
    emit: PropTypes.func,
    on: PropTypes.func,
    off: PropTypes.func,
  }).isRequired,
};
