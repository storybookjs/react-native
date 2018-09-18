import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Tabs } from '@storybook/components';

class SafeTab extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(error, info);
  }

  render() {
    const { hasError } = this.state;
    const { children, title, id } = this.props;
    if (hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return (
      <div id={id} title={title}>
        {children}
      </div>
    );
  }
}
SafeTab.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

const AddonPanel = ({ panels, onPanelSelect, selectedPanel, ...rest }) => (
  <Tabs
    {...rest}
    absolute
    selected={selectedPanel}
    onSelect={onPanelSelect}
    id="storybook-panel-root"
  >
    {Object.entries(panels).map(([k, v]) => (
      <SafeTab key={k} id={k} title={v.title}>
        {v.render({ active: k === selectedPanel })}
      </SafeTab>
    ))}
  </Tabs>
);
AddonPanel.propTypes = {
  selectedPanel: PropTypes.string,
  onPanelSelect: PropTypes.func.isRequired,
  panels: PropTypes.objectOf(
    PropTypes.shape({
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      render: PropTypes.func,
    })
  ).isRequired,
};
AddonPanel.defaultProps = {
  selectedPanel: null,
};

export default AddonPanel;
