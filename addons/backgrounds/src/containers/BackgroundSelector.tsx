import React, { Component, Fragment, ReactElement } from 'react';
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
  right?: ReactElement;
}

interface Input {
  name: string;
  value: string;
  default?: boolean;
}

const iframeId = 'storybook-preview-iframe';

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

const mapper = ({ api, state }: Combo): { items: Input[]; selected: string | null } => {
  const story = state.storiesHash[state.storyId];
  const list = story ? api.getParameters(story.id, PARAM_KEY) : [];
  const selected = state.addons[PARAM_KEY] || null;

  return { items: list || [], selected };
};

const getDisplayedItems = memoize(10)(
  (
    list: Input[],
    selected: string | null,
    change: (arg: { selected: string; name: string }) => void
  ) => {
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
  }
);

interface GlobalState {
  name: string | undefined;
  selected: string | undefined;
}

interface Props {
  api: API;
}

export class BackgroundSelector extends Component<Props> {
  change = ({ selected, name }: GlobalState) => {
    const { api } = this.props;
    if (typeof selected === 'string') {
      api.setAddonState<string>(PARAM_KEY, selected);
    }
    api.emit(EVENTS.UPDATE, { selected, name });
  };

  render() {
    return (
      <Consumer filter={mapper}>
        {({ items, selected }: ReturnType<typeof mapper>) => {
          const selectedBackgroundColor = getSelectedBackgroundColor(items, selected);

          return items.length ? (
            <Fragment>
              {selectedBackgroundColor ? (
                <Global
                  styles={(theme: Theme) => ({
                    [`#${iframeId}`]: {
                      backgroundColor:
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
                tooltip={({ onHide }) => (
                  <TooltipLinkList
                    links={getDisplayedItems(items, selectedBackgroundColor, i => {
                      this.change(i);
                      onHide();
                    })}
                  />
                )}
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
