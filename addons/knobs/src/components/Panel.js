import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import qs from 'qs';
import { document } from 'global';
import styled from '@emotion/styled';
import copy from 'copy-to-clipboard';

import { Placeholder, TabWrapper, TabsState, ActionBar, ActionButton } from '@storybook/components';

import Types from './types';
import PropForm from './PropForm';

const getTimestamp = () => +new Date();

const DEFAULT_GROUP_ID = 'ALL';

const PanelWrapper = styled.div({
  height: '100%',
  overflow: 'auto',
  width: '100%',
});

export default class Panel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { knobs: {} };
    this.options = {};

    this.lastEdit = getTimestamp();
    this.loadedFromUrl = false;
  }

  componentDidMount() {
    const { channel, api } = this.props;
    channel.on('addon:knobs:setKnobs', this.setKnobs);
    channel.on('addon:knobs:setOptions', this.setOptions);

    this.stopListeningOnStory = api.onStory(() => {
      this.setState({ knobs: {} });
      channel.emit('addon:knobs:reset');
    });
  }

  componentWillUnmount() {
    const { channel } = this.props;

    channel.removeListener('addon:knobs:setKnobs', this.setKnobs);
    this.stopListeningOnStory();
  }

  setOptions = (options = { timestamps: false }) => {
    this.options = options;
  };

  setKnobs = ({ knobs, timestamp }) => {
    const queryParams = {};
    const { api, channel } = this.props;

    if (!this.options.timestamps || !timestamp || this.lastEdit <= timestamp) {
      Object.keys(knobs).forEach(name => {
        const knob = knobs[name];
        // For the first time, get values from the URL and set them.
        if (!this.loadedFromUrl) {
          const urlValue = api.getQueryParam(`knob-${name}`);
          if (urlValue !== undefined) {
            // If the knob value present in url
            knob.value = Types[knob.type].deserialize(urlValue);
            channel.emit('addon:knobs:knobChange', knob);
          }
        }

        // set all knobsquery params to be deleted from URL
        queryParams[`knob-${name}`] = null;
      });

      api.setQueryParams(queryParams);
      this.setState({ knobs });

      this.loadedFromUrl = true;
    }
  };

  reset = () => {
    const { channel } = this.props;

    channel.emit('addon:knobs:reset');
  };

  copy = () => {
    const { location } = document;
    const query = qs.parse(location.search.replace('?', ''));
    const { knobs } = this.state;

    Object.entries(knobs).forEach(([name, knob]) => {
      query[`knob-${name}`] = Types[knob.type].serialize(knob.value);
    });

    copy(`${location.origin + location.pathname}?${qs.stringify(query)}`);

    // TODO: show some notification of this
  };

  emitChange = changedKnob => {
    const { channel } = this.props;

    channel.emit('addon:knobs:knobChange', changedKnob);
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
    const { channel } = this.props;

    channel.emit('addon:knobs:knobClick', knob);
  };

  render() {
    const { knobs } = this.state;
    const { active } = this.props;

    if (!active) {
      return null;
    }

    const groups = {};
    const groupIds = [];

    let knobsArray = Object.keys(knobs).filter(key => knobs[key].used);

    knobsArray
      .filter(key => knobs[key].groupId)
      .forEach(key => {
        const knobKeyGroupId = knobs[key].groupId;
        groupIds.push(knobKeyGroupId);
        groups[knobKeyGroupId] = {
          render: ({ active: groupActive, selected }) => (
            <TabWrapper active={groupActive || selected === DEFAULT_GROUP_ID}>
              <PropForm
                knobs={knobsArray.filter(knob => knob.groupId === knobKeyGroupId)}
                onFieldChange={this.handleChange}
                onFieldClick={this.handleClick}
              />
            </TabWrapper>
          ),
          title: knobKeyGroupId,
        };
      });

    groups[DEFAULT_GROUP_ID] = {
      render: () => null,
      title: DEFAULT_GROUP_ID,
    };

    knobsArray = knobsArray.map(key => knobs[key]);

    if (knobsArray.length === 0) {
      return <Placeholder>NO KNOBS</Placeholder>;
    }

    return (
      <PanelWrapper>
        {groupIds.length > 0 ? (
          <TabsState>
            {Object.entries(groups).map(([k, v]) => (
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
        <ActionBar>
          <ActionButton onClick={this.copy}>COPY</ActionButton>
          <ActionButton onClick={this.reset}>RESET</ActionButton>
        </ActionBar>
      </PanelWrapper>
    );
  }
}

Panel.propTypes = {
  active: PropTypes.bool.isRequired,
  onReset: PropTypes.object, // eslint-disable-line
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    onStory: PropTypes.func,
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
};
