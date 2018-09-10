import { document } from 'global';
import React from 'react';
import PropTypes from 'prop-types';
import addons from '@storybook/addons';
import ResourcePanel from './ResourcePanel';

const storybookIframe = 'storybook-preview-iframe';

export class Resources extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { resources: [] };
    this.onAddResources = this.onAddResources.bind(this);
  }

  componentDidMount() {
    const { channel } = this.props;
    this.iframe = document.getElementById(storybookIframe);

    if (!this.iframe) {
      throw new Error('Cannot find Storybook iframe');
    }

    // Listen to the notes and render it.
    channel.on('storybook/resources/add_resources', this.onAddResources);

    // Lets not reset resources when stories are changed!
    // this.stopListeningOnStory = api.onStory(() => {
    //   this.onAddResources([]);
    // });
  }

  // This is some cleanup tasks when the Notes panel is unmounting.
  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    this.unmounted = true;
    const { channel } = this.props;
    channel.removeListener('storybook/resources/add_resources', this.onAddResources);
  }

  onAddResources(resources) {
    this.setState({ resources });
  }

  render() {
    const { active } = this.props;
    const { resources } = this.state;

    return active ? (
      <ResourcePanel className="addon-resources-container" resources={resources} />
    ) : null;
  }
}

Resources.propTypes = {
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

addons.register('storybook/resources', api => {
  const channel = addons.getChannel();
  addons.addPanel('storybook/resources/panel', {
    title: 'Resources',
    // eslint-disable-next-line react/prop-types
    render: ({ active }) => <Resources channel={channel} api={api} active={active} />,
  });
});
