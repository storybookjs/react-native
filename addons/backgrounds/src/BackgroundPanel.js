import { document } from 'global';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import addons from '@storybook/addons';

import styled from 'react-emotion';

import Events from './events';
import Swatch from './Swatch';

const Wrapper = styled('div')({
  padding: 20,
});

const Title = styled('h5')({
  fontSize: 16,
});

const Pre = styled('pre')({
  padding: '30px',
  display: 'block',
  background: 'rgba(19,19,19,0.9)',
  color: 'rgba(255,255,255,0.95)',
  marginTop: '15px',
  lineHeight: '1.75em',
});

const List = styled('div')({
  display: 'inline-block',
  padding: 15,
});
const Item = styled('div')({
  display: 'inline-block',
  padding: 5,
});

const storybookIframe = 'storybook-preview-iframe';
const style = {
  iframe: {
    transition: 'background 0.25s ease-in-out',
  },
};

const defaultBackground = {
  name: 'default',
  value: 'transparent',
};

const instructionsHtml = `
import { storiesOf } from "@storybook/react";
import backgrounds from "@storybook/addon-backgrounds";

storiesOf("First Component", module)
  .addDecorator(backgrounds([
    { name: "twitter", value: "#00aced" },
    { name: "facebook", value: "#3b5998" },
  ]))
  .add("First Button", () => <button>Click me</button>);
`.trim();

const Instructions = () => (
  <Wrapper>
    <Title>Setup Instructions</Title>
    <p>
      Please add the background decorator definition to your story. The background decorate accepts
      an array of items, which should include a name for your color (preferably the css class name)
      and the corresponding color / image value.
    </p>
    <p>Below is an example of how to add the background decorator to your story definition.</p>
    <Pre>
      <code>{instructionsHtml}</code>
    </Pre>
  </Wrapper>
);

export default class BackgroundPanel extends Component {
  constructor(props) {
    super(props);

    const { channel } = props;

    // A channel is explicitly passed in for testing
    if (channel) {
      this.channel = channel;
    } else {
      this.channel = addons.getChannel();
    }

    this.state = { backgrounds: [] };
  }

  componentDidMount() {
    this.iframe = document.getElementById(storybookIframe);

    if (!this.iframe) {
      throw new Error('Cannot find Storybook iframe');
    }

    Object.keys(style.iframe).forEach(prop => {
      this.iframe.style[prop] = style.iframe[prop];
    });

    const { api } = this.props;

    this.channel.on(Events.SET, backgrounds => {
      this.setState({ backgrounds });
      const currentBackground = api.getQueryParam('background');

      if (currentBackground && backgrounds.some(bg => bg.value === currentBackground)) {
        this.updateIframe(currentBackground);
      } else if (backgrounds.filter(x => x.default).length) {
        const defaultBgs = backgrounds.filter(x => x.default);
        this.updateIframe(defaultBgs[0].value);
      }
    });

    this.channel.on(Events.UNSET, () => {
      this.setState({ backgrounds: [] });
      this.updateIframe('none');
    });
  }

  setBackgroundFromSwatch = background => {
    this.updateIframe(background);
    this.props.api.setQueryParams({ background });
  };

  updateIframe(background) {
    this.iframe.style.background = background;
  }

  render() {
    const backgrounds = [...this.state.backgrounds];

    if (!backgrounds.length) return <Instructions />;

    const hasDefault = backgrounds.filter(x => x.default).length;
    if (!hasDefault) backgrounds.push(defaultBackground);

    return (
      <List>
        {backgrounds.map(({ value, name }) => (
          <Item key={`${name} ${value}`}>
            <Swatch value={value} name={name} setBackground={this.setBackgroundFromSwatch} />
          </Item>
        ))}
      </List>
    );
  }
}
BackgroundPanel.propTypes = {
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
