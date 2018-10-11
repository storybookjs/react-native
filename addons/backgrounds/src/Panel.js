import { document } from 'global';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { SyntaxHighlighter, Heading } from '@storybook/components';

import Events from './constants';
import Swatch from './Swatch';

const Wrapper = styled.div({
  padding: 20,
});

const List = styled.div({
  display: 'inline-block',
  padding: 15,
});
const Item = styled.div({
  display: 'inline-block',
  padding: 5,
});

const storybookIframe = 'storybook-preview-background';
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
import { storiesOf } from '@storybook/react';
import { withBackgrounds } from '@storybook/addon-backgrounds';

storiesOf('First Component', module)
  .addDecorator(withBackgrounds([
    { name: 'twitter', value: '#00aced' },
    { name: 'facebook', value: '#3b5998" },
  ]))
  .add("First Button", () => <button>Click me</button>);
`.trim();

const Instructions = () => (
  <Wrapper>
    <Heading>Setup Instructions</Heading>
    <p>
      Please add the background decorator definition to your story. The background decorate accepts
      an array of items, which should include a name for your color (preferably the css class name)
      and the corresponding color / image value.
    </p>
    <p>Below is an example of how to add the background decorator to your story definition.</p>
    <SyntaxHighlighter language="jsx" copyable bordered>
      {instructionsHtml}
    </SyntaxHighlighter>
  </Wrapper>
);

export default class Panel extends Component {
  constructor(props) {
    super(props);

    this.state = { backgrounds: [] };
  }

  componentDidMount() {
    const { api, channel } = this.props;
    channel.on(Events.SET, data => {
      this.iframe = document.getElementById(storybookIframe);

      if (!this.iframe) {
        return;
        // throw new Error('Cannot find Storybook iframe');
      }

      Object.keys(style.iframe).forEach(prop => {
        this.iframe.style[prop] = style.iframe[prop];
      });

      const backgrounds = [...data];

      this.setState({ backgrounds });
      const current = api.getQueryParam('background');
      const defaultOrFirst = backgrounds.find(x => x.default) || backgrounds[0];

      if (current && backgrounds.find(bg => bg.value === current)) {
        this.updateIframe(current);
      } else if (defaultOrFirst) {
        this.updateIframe(defaultOrFirst.value);
        api.setQueryParams({ background: defaultOrFirst.value });
      }
    });

    channel.on(Events.UNSET, () => {
      if (!this.iframe) {
        return;
        // throw new Error('Cannot find Storybook iframe');
      }
      this.setState({ backgrounds: [] });
      this.updateIframe('none');
    });
  }

  setBackgroundFromSwatch = background => {
    const { api } = this.props;
    this.updateIframe(background);
    api.setQueryParams({ background });
  };

  updateIframe(background) {
    this.iframe.style.background = background;
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
Panel.propTypes = {
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
Panel.defaultProps = {
  channel: undefined,
};
