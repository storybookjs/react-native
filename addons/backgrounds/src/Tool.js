import { document } from 'global';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';

import { styled } from '@storybook/theming';
import { logger } from '@storybook/client-logger';
import { SET_STORIES } from '@storybook/core-events';

import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';

import { PARAM_KEY } from './constants';

export const ColorIcon = styled.span(({ background }) => ({
  borderRadius: '1rem',
  display: 'block',
  height: '1rem',
  width: '1rem',
  background,
}));

const getIframe = () => document.getElementById('storybook-preview-background');

const getState = (props, state) => {
  const data = props.api.getCurrentStoryData();
  const list = data && data.parameters && data.parameters[PARAM_KEY];

  return list && list.length
    ? list.reduce(
        (acc, { name, value, default: isSelected }) => {
          acc.backgrounds.push({ name, value });

          if (isSelected && state.selected !== 'transparent') {
            if (!list.find(i => i.value === state.selected)) {
              acc.selected = value;
            }
          }
          return acc;
        },
        {
          backgrounds: [],
          selected: state.selected,
        }
      )
    : {
        backgrounds: [],
        selected: 'transparent',
      };
};

const apply = memoize(1)((value, iframe) => {
  if (iframe) {
    // eslint-disable-next-line no-param-reassign
    iframe.style.background = value;
  } else {
    logger.error('Cannot find Storybook iframe');
  }
});

export default class BackgroundTool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      backgrounds: [],
      selected: 'transparent',
    };
  }

  componentDidMount() {
    const { api } = this.props;

    api.on(SET_STORIES, () => {
      const { state, props } = this;
      this.setState(getState(props, state));
    });
  }

  change = selected => {
    this.setState({ selected }, this.apply);
  };

  render() {
    const { backgrounds, selected } = getState(this.props, this.state);
    const iframe = getIframe();

    apply(selected, iframe);

    let backgroundsTooltip = backgrounds.map(([{ name, value }]) => ({
      title: name,
      onClick: () => {
        this.change(value);
      },
      right: <ColorIcon background={value} />,
    }));

    if (selected !== 'transparent') {
      backgroundsTooltip = [
        {
          title: 'Reset background',
          onClick: () => {
            this.change('transparent');
          },
        },
        ...backgroundsTooltip,
      ];
    }

    return backgrounds.length ? (
      <WithTooltip
        placement="top"
        trigger="click"
        tooltip={<TooltipLinkList links={backgroundsTooltip} />}
        closeOnClick
      >
        <IconButton key="background" title="Backgrounds">
          <Icons icon="photo" />
        </IconButton>
      </WithTooltip>
    ) : null;
  }
}
BackgroundTool.propTypes = {
  api: PropTypes.shape({
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }),
};
BackgroundTool.defaultProps = {
  channel: undefined,
};
