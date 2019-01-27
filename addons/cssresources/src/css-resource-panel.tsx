import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { SyntaxHighlighter } from '@storybook/components';

import events, { STORY_CHANGED } from '@storybook/core-events';
import EVENTS, { PARAM_KEY } from './constants';
import Channel from '@storybook/channels';

interface CssResourcePanelProps {
  active: boolean;
  channel: Channel;
  api: {
    emit: (event: any, data: any) => void;
    on: (event: events, callback: (data: any) => void) => void;
    off: (event: events, callback: (data: any) => void) => void;
    getQueryParam: () => void;
    getParameters: (id: string, paramKey: string) => any;
    setQueryParams: () => void;
  };
}

export default class CssResourcePanel extends Component<CssResourcePanelProps, any> {
  constructor(props: CssResourcePanelProps) {
    super(props);

    this.state = {
      list: [],
    };
  }

  componentDidMount() {
    const { api } = this.props;
    api.on(STORY_CHANGED, this.onStoryChange);
  }

  componentWillUnmount() {
    const { api } = this.props;
    api.off(STORY_CHANGED, this.onStoryChange);
  }

  onStoryChange = (id: string) => {
    const { api } = this.props;
    const list = api.getParameters(id, PARAM_KEY) as any[];

    if (list) {
      const picked = list.filter(res => res.picked);
      this.setState({ list }, () => this.emit(picked));
    }
  };

  onChange = (event: any) => {
    const { list: oldList } = this.state;
    const list = oldList.map((i: any) => ({
      ...i,
      picked: i.id === event.target.id ? event.target.checked : i.picked,
    }));
    this.setState({ list }, () => this.emit(list.filter((res: any) => res.picked)));
  };

  emit(list: any[]) {
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
          list.map(({ id, code, picked }: any) => (
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

(CssResourcePanel as any).propTypes = {
  active: PropTypes.bool.isRequired,
  channel: PropTypes.shape({
    on: PropTypes.func,
    emit: PropTypes.func,
    removeListener: PropTypes.func,
  }).isRequired,
  api: PropTypes.shape({
    on: PropTypes.func,
    getQueryParam: PropTypes.func,
    setQueryParams: PropTypes.func,
  }).isRequired,
};
