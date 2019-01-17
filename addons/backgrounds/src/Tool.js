import { document } from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoizerific';

import { logger } from '@storybook/client-logger';
import { STORY_CHANGED } from '@storybook/core-events';

import { Popout, Item, Icons, Icon, IconButton, Title, Detail, List } from '@storybook/components';
import * as S from './components';

import { PARAM_KEY } from './constants';

const toList = memoize(50)(viewports => Object.entries(viewports));
const getIframe = memoize(1)(() => document.getElementById('storybook-preview-background'));

export default class BackgroundTool extends Component {
  constructor(props) {
    super(props);

    this.state = {
      backgrounds: {},
      selected: undefined,
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
    const params = api.getParameters(id, PARAM_KEY);

    if (params && !params.disable) {
      const { backgrounds, selected } = params.reduce(
        (acc, { name, value, default: isSelected }) => {
          Object.assign(acc.backgrounds, { [name]: value });
          if (isSelected) {
            acc.selected = name;
          }
          return acc;
        },
        {
          backgrounds: {},
          selected: undefined,
        }
      );
      this.setState({ backgrounds, selected }, this.apply);
    } else {
      this.setState({ backgrounds: {}, selected: undefined }, this.apply);
    }
  };

  apply = () => {
    const iframe = getIframe();
    if (iframe) {
      const { selected, backgrounds } = this.state;

      if (selected) {
        const value = backgrounds[selected];
        if (backgrounds[selected]) {
          iframe.style.background = value;
        } else {
          logger.error(selected, 'could not be set');
        }
      } else {
        iframe.style.background = 'transparent';
      }
    } else {
      logger.error('Cannot find Storybook iframe');
    }
  };

  change = key => {
    this.setState({ selected: key }, this.apply);
  };

  render() {
    const { backgrounds, selected } = this.state;
    const list = toList(backgrounds);

    if (!list.length) {
      return null;
    }

    return (
      <Fragment>
        <Popout key="backgrounds">
          <IconButton key="background" title="Backgrounds">
            <Icons icon="photo" />
          </IconButton>
          {({ hide }) => (
            <List>
              {selected !== undefined ? (
                <Fragment>
                  <Item
                    key="reset"
                    onClick={() => {
                      hide();
                      this.change(undefined);
                    }}
                  >
                    <Icon type="undo" />
                    <Title>Reset</Title>
                    <Detail>transparent</Detail>
                  </Item>
                </Fragment>
              ) : null}

              {list.map(([key, value]) => (
                <Item
                  key={key}
                  onClick={() => {
                    hide();
                    this.change(key);
                  }}
                >
                  <Icon type={<S.ColorIcon background={value} />} />
                  <Title>{key}</Title>
                  <Detail>{value}</Detail>
                </Item>
              ))}
            </List>
          )}
        </Popout>
      </Fragment>
    );
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
