import React, { Component, Fragment } from 'react';
import memoize from 'memoizerific';

import { Combo, Consumer, API } from '@storybook/api';
import { Global, Theme } from '@storybook/theming';

import { Icons, IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';

import { PARAM_KEY, EVENTS } from '../constants';
import { ColorIcon } from '../components/ColorIcon';

interface Item {
  id: string;
  title: string;
  onClick: () => void;
  value: string;
  right?: any;
}

interface Input {
  name: string;
  value: string;
  default?: boolean;
}

const iframeId = 'storybook-preview-background';

const createBackgroundSelectorItem = memoize(1000)(
  (
    id: string,
    name: string,
    value: string,
    hasSwatch: boolean,
    change: (arg: { selected: string; name: string }) => void
  ): Item => ({
    id: id || name,
    title: name,
    onClick: () => {
      change({ selected: value, name });
    },
    value,
    right: hasSwatch ? <ColorIcon background={value} /> : undefined,
  })
);

const getSelectedBackgroundColor = (list: Input[], currentSelectedValue: string): string => {
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

const mapper = ({ api, state }: Combo): { items: Input[] } => {
  const story = state.storiesHash[state.storyId];
  const list = story ? api.getParameters(story.id, PARAM_KEY) : [];

  return { items: list || [] };
};

const getDisplayedItems = memoize(10)((list: Input[], selected: State['selected'], change) => {
  let availableBackgroundSelectorItems: Item[] = [];

  if (selected !== 'transparent') {
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

  return availableBackgroundSelectorItems;
});

interface State {
  selected: string;
  expanded: boolean;
}

export class BackgroundSelector extends Component<{ api: API }, State> {
  state: State = {
    selected: null,
    expanded: false,
  };

  change = ({ selected, name }: { selected: string; name: string }) => {
    this.props.api.emit(EVENTS.UPDATE, { selected, name });
    this.setState({ selected, expanded: false });
  };

  onVisibilityChange = (s: boolean) => {
    if (this.state.expanded !== s) {
      this.setState({ expanded: s });
    }
  };

  render() {
    const { expanded, selected } = this.state;

    return (
      <Consumer filter={mapper}>
        {({ items }: { items: Input[] }) => {
          const selectedBackgroundColor = getSelectedBackgroundColor(items, selected);
          const links = getDisplayedItems(items, selectedBackgroundColor, this.change);

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
                onVisibilityChange={this.onVisibilityChange}
                tooltip={<TooltipLinkList links={links} />}
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
        }}
      </Consumer>
    );
  }
}
