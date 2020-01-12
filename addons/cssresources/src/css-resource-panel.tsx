import React, { Component, Fragment } from 'react';
import { SyntaxHighlighter, Placeholder, Spaced, Icons } from '@storybook/components';
import { STORY_RENDERED } from '@storybook/core-events';
import { API } from '@storybook/api';
import { styled } from '@storybook/theming';

import { EVENTS, PARAM_KEY } from './constants';
import { CssResource } from './CssResource';

interface Props {
  active: boolean;
  api: API;
}

interface State {
  currentStoryId: string;
  list: CssResource[];
}

interface CssResourceLookup {
  [key: string]: CssResource;
}

const maxLimitToUseSyntaxHighlighter = 100000;

const PlainCode = styled.pre({
  textAlign: 'left',
  fontWeight: 'normal',
});

const Warning = styled.div({
  display: 'flex',
  padding: '10px',
  justifyContent: 'center',
  alignItems: 'center',
  background: '#fff3cd',
  fontSize: 12,
  '& svg': {
    marginRight: 10,
    width: 24,
    height: 24,
  },
});

export class CssResourcePanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentStoryId: '',
      list: [],
    };
  }

  componentDidMount() {
    const { api } = this.props;
    api.on(STORY_RENDERED, this.onStoryChange);
  }

  componentWillUnmount() {
    const { api } = this.props;
    api.off(STORY_RENDERED, this.onStoryChange);
  }

  onStoryChange = (id: string) => {
    const { list: currentList, currentStoryId } = this.state;
    const { api } = this.props;
    const list = api.getParameters(id, PARAM_KEY) as CssResource[];

    if (list && currentStoryId !== id) {
      const existingIds = currentList.reduce((lookup: CssResourceLookup, res) => {
        // eslint-disable-next-line no-param-reassign
        lookup[res.id] = res;
        return lookup;
      }, {}) as CssResourceLookup;
      const mergedList = list.map(res => {
        const existingItem = existingIds[res.id];
        return existingItem
          ? {
              ...res,
              picked: existingItem.picked,
            }
          : res;
      });
      const picked = mergedList.filter(res => res.picked);
      this.setState({ list: mergedList, currentStoryId: id }, () => this.emit(picked));
    }
  };

  onChange = (event: any) => {
    const { list: oldList } = this.state;
    const list = oldList.map(i => ({
      ...i,
      picked: i.id === event.target.id ? event.target.checked : i.picked,
    }));
    this.setState({ list }, () => this.emit(list.filter((res: any) => res.picked)));
  };

  emit(list: CssResource[]) {
    const { api } = this.props;
    api.emit(EVENTS.SET, list);
  }

  render() {
    const { list } = this.state;
    const { active } = this.props;

    if (!active) {
      return null;
    }

    return (
      <div>
        {list &&
          list.map(({ id, code, picked }) => (
            <div key={id} style={{ padding: 10 }}>
              <label>
                <input type="checkbox" checked={picked} onChange={this.onChange} id={id} />
                <span>#{id}</span>
              </label>
              {code && code.length < maxLimitToUseSyntaxHighlighter && (
                <SyntaxHighlighter language="html">{code}</SyntaxHighlighter>
              )}
              {code && code.length >= maxLimitToUseSyntaxHighlighter && (
                <Placeholder>
                  <Spaced row={1}>
                    <PlainCode>{code.substring(0, maxLimitToUseSyntaxHighlighter)} ...</PlainCode>
                    <Warning>
                      <Icons icon="alert" />
                      Rest of the content cannot be displayed
                    </Warning>
                  </Spaced>
                </Placeholder>
              )}
            </div>
          ))}
      </div>
    );
  }
}
