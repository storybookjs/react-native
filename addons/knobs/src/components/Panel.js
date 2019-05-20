import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { document } from 'global';
import { styled } from '@storybook/theming';
import copy from 'copy-to-clipboard';

import { STORY_CHANGED } from '@storybook/core-events';
import {
  Placeholder,
  TabWrapper,
  TabsState,
  ActionBar,
  Link,
  ScrollArea,
} from '@storybook/components';
import { RESET, SET, CHANGE, SET_OPTIONS, CLICK } from '../shared';

import Types from './types';
import PropForm from './PropForm';

const getTimestamp = () => +new Date();

export const DEFAULT_GROUP_ID = 'Other';

const PanelWrapper = styled(({ children, className }) => (
  <ScrollArea horizontal vertical className={className}>
    {children}
  </ScrollArea>
))({
  height: '100%',
  width: '100%',
});

export default class KnobPanel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      knobs: {},
    };
    this.options = {};

    this.lastEdit = getTimestamp();
    this.loadedFromUrl = false;
  }

  componentDidMount() {
    this.mounted = true;
    const { api } = this.props;
    api.on(SET, this.setKnobs);
    api.on(SET_OPTIONS, this.setOptions);

    this.stopListeningOnStory = api.on(STORY_CHANGED, () => {
      if (this.mounted) {
        this.setKnobs({ knobs: {} });
      }
      this.setKnobs({ knobs: {} });
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    const { api } = this.props;

    api.off(SET, this.setKnobs);
    this.stopListeningOnStory();
  }

  setOptions = (options = { timestamps: false }) => {
    this.options = options;
  };

  setKnobs = ({ knobs, timestamp }) => {
    const queryParams = {};
    const { api } = this.props;

    if (!this.options.timestamps || !timestamp || this.lastEdit <= timestamp) {
      Object.keys(knobs).forEach(name => {
        const knob = knobs[name];
        // For the first time, get values from the URL and set them.
        if (!this.loadedFromUrl) {
          const urlValue = api.getQueryParam(`knob-${name}`);

          // If the knob value present in url
          if (urlValue !== undefined) {
            const value = Types[knob.type].deserialize(urlValue);
            knob.value = value;
            queryParams[`knob-${name}`] = Types[knob.type].serialize(value);

            api.emit(CHANGE, knob);
          }
        }
      });

      api.setQueryParams(queryParams);
      this.setState({ knobs });

      this.loadedFromUrl = true;
    }
  };

  reset = () => {
    const { api } = this.props;

    api.emit(RESET);
  };

  copy = () => {
    const { location } = document;
    const query = qs.parse(location.search, { ignoreQueryPrefix: true });
    const { knobs } = this.state;

    Object.entries(knobs).forEach(([name, knob]) => {
      query[`knob-${name}`] = Types[knob.type].serialize(knob.value);
    });

    copy(`${location.origin + location.pathname}?${qs.stringify(query, { encode: false })}`);

    // TODO: show some notification of this
  };

  emitChange = changedKnob => {
    const { api } = this.props;

    api.emit(CHANGE, changedKnob);
  };

  handleChange = changedKnob => {
    this.lastEdit = getTimestamp();
    const { knobs } = this.state;
    const { name } = changedKnob;
    const newKnobs = { ...knobs };
    newKnobs[name] = {
      ...newKnobs[name],
      ...changedKnob,
    };

    this.setState({ knobs: newKnobs }, this.emitChange(changedKnob));
  };

  handleClick = knob => {
    const { api } = this.props;

    api.emit(CLICK, knob);
  };

  render() {
    const { knobs } = this.state;
    const { active: panelActive } = this.props;
    if (!panelActive) {
      return null;
    }

    const groups = {};
    const groupIds = [];

    const knobKeysArray = Object.keys(knobs).filter(key => knobs[key].used);

    knobKeysArray.forEach(key => {
      const knobKeyGroupId = knobs[key].groupId || DEFAULT_GROUP_ID;
      groupIds.push(knobKeyGroupId);
      groups[knobKeyGroupId] = {
        render: ({ active }) => (
          <TabWrapper key={knobKeyGroupId} active={active}>
            <PropForm
              // false positive
              // eslint-disable-next-line no-use-before-define
              knobs={knobsArray.filter(
                knob => (knob.groupId || DEFAULT_GROUP_ID) === knobKeyGroupId
              )}
              onFieldChange={this.handleChange}
              onFieldClick={this.handleClick}
            />
          </TabWrapper>
        ),
        title: knobKeyGroupId,
      };
    });

    const knobsArray = knobKeysArray.map(key => knobs[key]);

    if (knobsArray.length === 0) {
      return (
        <Placeholder>
          <Fragment>No knobs found</Fragment>
          <Fragment>
            Learn how to{' '}
            <Link
              href="https://github.com/storybooks/storybook/tree/master/addons/knobs"
              target="_blank"
              withArrow
            >
              dynamically interact with components
            </Link>
          </Fragment>
        </Placeholder>
      );
    }

    // Always sort DEFAULT_GROUP_ID (ungrouped) tab last without changing the remaining tabs
    const sortEntries = g => {
      const unsortedKeys = Object.keys(g);
      if (unsortedKeys.indexOf(DEFAULT_GROUP_ID) !== -1) {
        const sortedKeys = unsortedKeys.filter(key => key !== DEFAULT_GROUP_ID);
        sortedKeys.push(DEFAULT_GROUP_ID);
        return sortedKeys.map(key => [key, g[key]]);
      }
      return Object.entries(g);
    };

    const entries = sortEntries(groups);

    return (
      <Fragment>
        <PanelWrapper>
          {entries.length > 1 ? (
            <TabsState>
              {entries.map(([k, v]) => (
                <div id={k} key={k} title={v.title}>
                  {v.render}
                </div>
              ))}
            </TabsState>
          ) : (
            <PropForm
              knobs={knobsArray}
              onFieldChange={this.handleChange}
              onFieldClick={this.handleClick}
            />
          )}
        </PanelWrapper>
        <ActionBar
          actionItems={[
            { title: 'Copy', onClick: this.copy },
            { title: 'Reset', onClick: this.reset },
          ]}
        />
      </Fragment>
    );
  }
}

KnobPanel.propTypes = {
  active: PropTypes.bool.isRequired,
  onReset: PropTypes.object, // eslint-disable-line
  api: PropTypes.shape({
    on: PropTypes.func,
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
};
