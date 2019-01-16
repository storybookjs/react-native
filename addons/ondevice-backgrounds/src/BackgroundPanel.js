import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import Events from './constants';
import Swatch from './Swatch';

const defaultBackground = {
  name: 'default',
  value: 'transparent',
};

const instructionsHtml = `
import { storiesOf } from '@storybook/react-native';

storiesOf('First Component', module)
  .addParameters({
    backgrounds: [
      { name: 'warm', value: 'hotpink', default: true },
      { name: 'cool', value: 'deepskyblue' },
    ],
  })
  .add("First Button", () => <button>Click me</button>);
`.trim();

const Instructions = () => (
  <View>
    <Text style={{ fontSize: 16 }}>Setup Instructions</Text>
    <Text>
      Please add the background decorator definition to your story. The background decorate accepts
      an array of items, which should include a name for your color (preferably the css class name)
      and the corresponding color / image value.
    </Text>
    <Text>
      Below is an example of how to add the background decorator to your story definition.
    </Text>
    <Text>{instructionsHtml}</Text>
  </View>
);

export default class BackgroundPanel extends Component {
  constructor(props) {
    super(props);

    this.state = { backgrounds: [] };
  }

  componentDidMount() {
    const { channel } = this.props;

    this.onSet = channel.on(Events.SET, data => {
      const backgrounds = [...data];

      this.setState({ backgrounds });
    });

    this.onUnset = channel.on(Events.UNSET, () => {
      this.setState({ backgrounds: [] });
    });
  }

  componentWillUnmount() {
    const { channel } = this.props;
    channel.removeListener(Events.SET, this.onSet);
    channel.removeListener(Events.UNSET, this.onUnset);
  }

  setBackgroundFromSwatch = background => {
    this.update(background);
  };

  update(background) {
    const { channel } = this.props;
    channel.emit(Events.UPDATE_BACKGROUND, background);
  }

  render() {
    const { active } = this.props;
    const { backgrounds = [] } = this.state;

    if (!active) {
      return null;
    }
    if (!backgrounds.length) return <Instructions />;

    const hasDefault = backgrounds.filter(x => x.default).length;
    if (!hasDefault) backgrounds.push(defaultBackground);

    return (
      <View>
        {backgrounds.map(({ value, name }) => (
          <View key={`${name} ${value}`}>
            <Swatch value={value} name={name} setBackground={this.setBackgroundFromSwatch} />
          </View>
        ))}
      </View>
    );
  }
}
BackgroundPanel.propTypes = {
  active: PropTypes.bool.isRequired,
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
BackgroundPanel.defaultProps = {
  channel: undefined,
};
