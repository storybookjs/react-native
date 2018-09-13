import { document } from 'global';
import React, { Component } from 'react';
// import Events from '@storybook/core-events';
import PropTypes from 'prop-types';
import { Input, ActionButton } from '@storybook/components';
import styled from '@emotion/styled';

const storybookIframe = 'storybook-preview-iframe';

const PanelWrapper = styled.div({
  position: 'absolute',
  top: '10px',
  left: '10px',
  width: '50%',
});

const PanelWrapperRow = styled.div({
  display: 'flex',
  'flex-direction': 'row',
  padding: '3px',
});

export default class ResourcePanel extends Component {
  constructor(props) {
    super(props);
    this.nodes = [];
    this.state = { resources: [], addname: '' };
    this.onAddResources = this.onAddResources.bind(this);
  }

  componentDidMount() {
    const { channel } = this.props;
    this.iframe = document.getElementById(storybookIframe);
    if (!this.iframe) {
      throw new Error('Cannot find Storybook iframe');
    }
    channel.on('storybook/resources/add_resources', this.onAddResources);
  }

  componentDidUpdate() {
    this.loadResources();
  }

  componentWillUnmount() {
    const { channel } = this.props;
    channel.removeListener('storybook/resources/add_resources', this.onAddResources);
  }

  onAddResources(resources) {
    this.setState({ resources });
  }

  loadResources() {
    function loadResource(filename) {
      if (!filename) return null;

      let eL;
      if (filename.endsWith('js')) {
        // if filename is a external JavaScript file
        eL = document.createElement('script');
        eL.setAttribute('type', 'text/javascript');
        eL.setAttribute('src', filename);
      } else if (filename.endsWith('css')) {
        // if filename is an external CSS file
        eL = document.createElement('link');
        eL.setAttribute('rel', 'stylesheet');
        eL.setAttribute('type', 'text/css');
        eL.setAttribute('href', filename);
      }

      return this.iframe && eL ? this.iframe.contentDocument.head.appendChild(eL) : null;
    }

    const { resources = [] } = this.state;
    // const { channel } = this.props;

    resources.map(loadResource.bind(this)).forEach(node => {
      if (node) this.nodes.push(node);
    });
  }

  removeNodes() {
    this.nodes.forEach(x => x.parentNode.removeChild(x));
    this.nodes = [];
  }

  remove(i) {
    const { resources = [] } = this.state;
    this.setState({
      resources: resources.splice(i, 1),
    });
  }

  handleChange(e) {
    this.setState({ addname: e.target.value });
  }

  add() {
    const { resources = [], addname = '' } = this.state;
    // const { channel } = this.props;

    if (addname.trim() === '') return;

    this.setState({
      resources: resources.push(addname),
      addname: '',
    });
  }

  render() {
    const { resources = [], addname = '' } = this.state;
    const { active } = this.props;

    if (!active) {
      return null;
    }

    return (
      <PanelWrapper className="addon-resources-container">
        {resources &&
          resources.map((resource, i) => (
            /* eslint-disable react/no-array-index-key */
            <PanelWrapperRow key={i}>
              <Input value={resource} size="100%" readOnly />
              <ActionButton onClick={this.remove.bind(this, i)}>-</ActionButton>
            </PanelWrapperRow>
          ))}
        <PanelWrapperRow>
          <Input size="100%" value={addname} onChange={this.handleChange.bind(this)} />
          <ActionButton onClick={this.add.bind(this)}>+</ActionButton>
        </PanelWrapperRow>
      </PanelWrapper>
    );
  }
}

ResourcePanel.propTypes = {
  active: PropTypes.bool.isRequired,
  channel: PropTypes.shape({
    on: PropTypes.func,
    emit: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    onStory: PropTypes.func,
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
};
