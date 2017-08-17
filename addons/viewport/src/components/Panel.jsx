import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { viewports } from './viewportInfo';

const storybookIframe = 'storybook-preview-iframe';

export class Panel extends Component {
  static propTypes = {
    channel: PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = { viewport: null };

    this.props.channel.on('addon:viewport:update', this.changeViewport);
  }

  componentDidMount() {
    this.iframe = document.getElementById(storybookIframe);
  }

  iframe = undefined;

  changeViewport = viewport => {
    this.iframe.style = viewport.styles;
  };

  render() {
    return (
      <div>
        {viewports.map(viewport =>
          <button onClick={() => this.changeViewport(viewport)}>
            {viewport.name}
          </button>
        )}
      </div>
    );
  }
}
