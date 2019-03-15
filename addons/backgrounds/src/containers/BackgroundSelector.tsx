import React, { Component, Fragment } from 'react';
import memoize from 'memoizerific';

import { Global, Theme } from '@storybook/theming';

import { SET_STORIES } from '@storybook/core-events';

import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';

import { PARAM_KEY } from '../constants';
import { ColorIcon } from '../components/ColorIcon';
import { BackgroundConfig, BackgroundSelectorItem } from '../models';

const iframeId = 'storybook-preview-background';

const createBackgroundSelectorItem = memoize(1000)(
  (
    id: string,
    name: string,
    value: string,
    hasSwatch: boolean,
    change: (arg: { selected: string; expanded: boolean }) => void
  ): BackgroundSelectorItem => ({
    id: id || name,
    title: name,
    onClick: () => {
      change({ selected: value, expanded: false });
    },
    value,
    right: hasSwatch ? <ColorIcon background={value} /> : undefined,
  })
);

const getSelectedBackgroundColor = (
  list: BackgroundConfig[],
  currentSelectedValue: string
): string => {
  if (!list.length) {
    return 'transparent';
  }

  if (currentSelectedValue === 'transparent') {
    return currentSelectedValue;
  }

  if (list.find(i => i.value === currentSelectedValue)) {
    return currentSelectedValue;
  }

  if (list.find(i => i.default)) {
    return list.find(i => i.default).value;
  }

  return 'transparent';
};

const getDisplayableState = memoize(10)(
  (props: BackgroundToolProps, state: BackgroundToolState, change) => {
    const data = props.api.getCurrentStoryData();
    const list: BackgroundConfig[] = (data && data.parameters && data.parameters[PARAM_KEY]) || [];

    const selectedBackgroundColor = getSelectedBackgroundColor(list, state.selected);

    let availableBackgroundSelectorItems: BackgroundSelectorItem[] = [];

    if (selectedBackgroundColor !== 'transparent') {
      availableBackgroundSelectorItems.push(
        createBackgroundSelectorItem('reset', 'Clear background', 'transparent', null, change)
      );
    }

    if (list.length) {
      availableBackgroundSelectorItems = [
        ...availableBackgroundSelectorItems,
        ...list.map(({ name, value }) =>
          createBackgroundSelectorItem(null, name, value, true, change)
        ),
      ];
    }

    return {
      items: availableBackgroundSelectorItems,
      selectedBackgroundColor,
    };
  }
);

interface BackgroundToolProps {
  api: {
    on(event: string, callback: (data: any) => void): void;
    off(event: string, callback: (data: any) => void): void;
    getCurrentStoryData(): any;
  };
}

interface BackgroundToolState {
  items: BackgroundSelectorItem[];
  selected: string;
  expanded: boolean;
}

export class BackgroundSelector extends Component<BackgroundToolProps, BackgroundToolState> {
  private listener = () => {
    this.setState({ selected: null });
  };

  constructor(props: BackgroundToolProps) {
    super(props);

    this.state = {
      items: [],
      selected: null,
      expanded: false,
    };
  }

  componentDidMount() {
    const { api } = this.props;
    api.on(SET_STORIES, this.listener);
  }

  componentWillUnmount() {
    const { api } = this.props;
    api.off(SET_STORIES, this.listener);
  }

  change = (args: { selected: string; expanded: boolean }) => this.setState(args);

  render() {
    const { expanded } = this.state;
    const { items, selectedBackgroundColor } = getDisplayableState(
      this.props,
      this.state,
      this.change
    );

    return items.length ? (
      <Fragment>
        {selectedBackgroundColor ? (
          <Global
            styles={(theme: Theme) => ({
              [`#${iframeId}`]: {
                background:
                  selectedBackgroundColor === 'transparent'
                    ? theme.background.content
                    : selectedBackgroundColor,
              },
            })}
          />
        ) : null}
        <WithTooltip
          placement="top"
          trigger="click"
          tooltipShown={expanded}
          onVisibilityChange={(newVisibility: boolean) =>
            this.setState({ expanded: newVisibility })
          }
          tooltip={<TooltipLinkList links={items} />}
          closeOnClick
        >
          <IconButton
            key="background"
            active={selectedBackgroundColor !== 'transparent'}
            title="Change the background of the preview"
          >
            <Icons icon="photo" />
          </IconButton>
        </WithTooltip>
      </Fragment>
    ) : null;
  }
}
