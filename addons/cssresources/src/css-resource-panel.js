import { document } from 'global';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { SyntaxHighlighter } from '@storybook/components';

import { STORY_CHANGED } from '@storybook/core-events';
import EVENTS, { PARAM_KEY } from './constants';

const storybookIframe = 'storybook-preview-iframe';

export default class CssResourcePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    const { api } = this.props;
    this.iframe = document.getElementById(storybookIframe);
    if (!this.iframe) {
      throw new Error('Cannot find Storybook iframe');
    }
    api.on(STORY_CHANGED, this.onStoryChange);
  }

  componentWillUnmount() {
    const { api } = this.props;
    api.off(STORY_CHANGED, this.onStoryChange);
  }

  onStoryChange = id => {
    const { api } = this.props;
    const list = api.getParameters(id, PARAM_KEY);
    const picked = list.filter(res => res.picked);
    console.log({ list });

    if (list) {
      this.setState({ list }, () => this.emit(picked));
    }
  };

  onChange = event => {
    const { list: oldList } = this.state;
    const list = oldList.map(i => ({
      ...i,
      picked: i.id === event.target.id ? event.target.checked : i.picked,
    }));
    this.setState({ list }, () => this.emit(list.filter(res => res.picked)));
  };

  emit(list) {
    const { api } = this.props;
    api.emit(EVENTS.SET, list);
  }

  render() {
    const { list = [] } = this.state;
    const { active } = this.props;

    if (!active) {
      return null;
    }

    return (
      <Fragment>
        {list &&
          list.map(({ id, code, picked }) => (
            <div key={id} style={{ padding: 10 }}>
              <label>
                <input type="checkbox" checked={picked} onChange={this.onChange} id={id} />
                <span>#{id}</span>
              </label>
              {code ? <SyntaxHighlighter language="html">{code}</SyntaxHighlighter> : null}
            </div>
          ))}
      </Fragment>
    );
  }
}

CssResourcePanel.propTypes = {
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
