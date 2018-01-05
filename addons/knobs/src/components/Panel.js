import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import PropForm from './PropForm';
import Types from './types';

import AddonPanel from '../../../../lib/ui/src/modules/ui/components/addon_panel/index';

const getTimestamp = () => +new Date();

const styles = {
  panelWrapper: {
    width: '100%',
  },
  panel: {
    padding: '5px',
    width: 'auto',
    position: 'relative',
  },
  noKnobs: {
    fontFamily: `
      -apple-system, ".SFNSText-Regular", "San Francisco", "Roboto",
      "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif
    `,
    display: 'inline',
    width: '100%',
    textAlign: 'center',
    color: 'rgb(190, 190, 190)',
    padding: '10px',
  },
  resetButton: {
    position: 'absolute',
    bottom: 11,
    right: 10,
    border: 'none',
    borderTop: 'solid 1px rgba(0, 0, 0, 0.2)',
    borderLeft: 'solid 1px rgba(0, 0, 0, 0.2)',
    background: 'rgba(255, 255, 255, 0.5)',
    padding: '5px 10px',
    borderRadius: '4px 0 0 0',
    color: 'rgba(0, 0, 0, 0.5)',
    outline: 'none',
  },
};

export default class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setKnobs = this.setKnobs.bind(this);
    this.reset = this.reset.bind(this);
    this.setOptions = this.setOptions.bind(this);
    this.onPanelSelect = this.onPanelSelect.bind(this);

    this.state = { knobs: {}, groupId: 'ALL' };
    this.options = {};

    this.lastEdit = getTimestamp();
    this.loadedFromUrl = false;
    this.props.channel.on('addon:knobs:setKnobs', this.setKnobs);
    this.props.channel.on('addon:knobs:setOptions', this.setOptions);

    this.stopListeningOnStory = this.props.api.onStory(() => {
      this.setState({ knobs: [] });
      this.props.channel.emit('addon:knobs:reset');
    });
  }

  componentWillUnmount() {
    this.props.channel.removeListener('addon:knobs:setKnobs', this.setKnobs);
    this.stopListeningOnStory();
  }

  onPanelSelect(name) {
    this.setState({ groupId: name });
  }

  setOptions(options = { debounce: false, timestamps: false }) {
    this.options = options;

    if (options.debounce) {
      this.emitChange = debounce(this.emitChange, options.debounce.wait, {
        leading: options.debounce.leading,
      });
    }
  }

  setKnobs({ knobs, timestamp }) {
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

        queryParams[`knob-${name}`] = Types[knob.type].serialize(knob.value);
      });
      this.loadedFromUrl = true;
      api.setQueryParams(queryParams);
      this.setState({ knobs });
    }
  }

  reset() {
    this.props.channel.emit('addon:knobs:reset');
  }

  emitChange(changedKnob) {
    this.props.channel.emit('addon:knobs:knobChange', changedKnob);
  }

  handleChange(changedKnob) {
    this.lastEdit = getTimestamp();
    const { api } = this.props;
    const { knobs } = this.state;
    const { name, type, value } = changedKnob;
    const newKnobs = { ...knobs };
    newKnobs[name] = {
      ...newKnobs[name],
      ...changedKnob,
    };

    this.setState({ knobs: newKnobs });

    const queryParams = {};
    queryParams[`knob-${name}`] = Types[type].serialize(value);

    api.setQueryParams(queryParams);
    this.setState({ knobs: newKnobs }, this.emitChange(changedKnob));
  }

  handleClick(knob) {
    this.props.channel.emit('addon:knobs:knobClick', knob);
  }

  render() {
    const { knobs, groupId } = this.state;

    const groupIds = {
      ALL: {
        render: () => <div id="ALL">ALL</div>,
        title: 'ALL',
      },
    };

    Object.keys(knobs)
      .filter(key => knobs[key].used && knobs[key].groupId)
      .forEach(key => {
        const keyGroupId = knobs[key].groupId;
        groupIds[keyGroupId] = {
          render: () => <div id={keyGroupId}>{keyGroupId}</div>,
          title: keyGroupId,
        };
      });

    const knobsArray = Object.keys(knobs)
      .filter(key => {
        const filter =
          groupId === 'ALL' ? knobs[key].used : knobs[key].used && knobs[key].groupId === groupId;
        return filter;
      })
      .map(key => knobs[key]);

    if (knobsArray.length === 0) {
      return <div style={styles.noKnobs}>NO KNOBS</div>;
    }

    return (
      <div style={styles.panelWrapper}>
        <AddonPanel
          panels={groupIds}
          onPanelSelect={this.onPanelSelect}
          selectedPanel={this.state.groupId}
        />
        <div style={styles.panel}>
          <PropForm
            knobs={knobsArray}
            onFieldChange={this.handleChange}
            onFieldClick={this.handleClick}
          />
        </div>
        <button style={styles.resetButton} onClick={this.reset}>
          RESET
        </button>
      </div>
    );
  }
}

Panel.propTypes = {
  channel: PropTypes.shape({
    emit: PropTypes.func,
    on: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
  onReset: PropTypes.object, // eslint-disable-line
  api: PropTypes.shape({
    onStory: PropTypes.func,
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
};
