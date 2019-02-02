import { document } from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';

import { Global, css } from '@storybook/theming';

import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';
import { STORY_CHANGED } from '@storybook/core-events';
import { logger } from '@storybook/client-logger';

import { PARAM_KEY } from './constants';

const toList = memoize(50)(viewports => Object.entries(viewports));
const getIframe = memoize(1)(() => document.getElementById('storybook-preview-iframe'));
const iframeClass = 'storybook-preview-iframe-viewport';

export default class ViewportTool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewports: {},
      selected: undefined,
      isRotated: false,
    };
  }

  componentDidMount() {
    const { api } = this.props;
    api.on(STORY_CHANGED, this.onStoryChange);
  }

  componentWillUnmount() {
    const { api } = this.props;
    api.off(STORY_CHANGED, this.onStoryChange);
  }

  onStoryChange = id => {
    const { api } = this.props;
    const viewports = api.getParameters(id, PARAM_KEY);

    if (viewports) {
      this.setState({ viewports });
    }
  };

  change = key => {
    this.setState({ selected: key }, () => {
      this.apply();
    });
  };

  rotate = () => {
    const { isRotated } = this.state;
    this.setState({ isRotated: !isRotated }, () => {
      this.apply();
    });
  };

  apply = () => {
    const iframe = getIframe();
    const { isRotated, selected, viewports } = this.state;

    if (iframe) {
      if (selected) {
        const {
          styles: { width: a, height: b },
        } = viewports[selected];
        iframe.style.width = isRotated ? b : a;
        iframe.style.height = isRotated ? a : b;

        if (!iframe.classList.item(iframeClass)) {
          iframe.classList.add(iframeClass);
        }
      } else {
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.classList.remove(iframeClass);
      }
    } else {
      logger.error('Cannot find Storybook iframe');
    }
  };

  render() {
    const { viewports, selected } = this.state;

    const list = toList(viewports);

    let viewportsTooltip = list.map(([key, { name, styles }]) => ({
      title: name,
      onClick: () => {
        this.change(key);
      },
      right: `${styles.width}-${styles.height}`,
    }));

    if (selected !== undefined) {
      viewportsTooltip = [
        {
          title: 'Reset viewport',
          onClick: () => {
            this.change(undefined);
          },
        },
        {
          title: 'Rotate viewport',
          onClick: () => {
            this.rotate();
          },
        },
        ...viewportsTooltip,
      ];
    }

    if (!list.length) {
      return null;
    }

    return (
      <Fragment>
        <Global
          styles={css({
            [`.${iframeClass}`]: {
              border: '10px solid black',
              borderRadius: 4,
              margin: 10,
            },
          })}
        />
        <WithTooltip
          placement="top"
          trigger="click"
          tooltip={<TooltipLinkList links={viewportsTooltip} />}
          closeOnClick
        >
          <IconButton key="viewport" title="Change Viewport">
            <Icons icon="grow" />
          </IconButton>
        </WithTooltip>
      </Fragment>
    );
  }
}

ViewportTool.propTypes = {
  channel: PropTypes.shape({
    on: PropTypes.func,
    emit: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    on: PropTypes.func,
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
};
