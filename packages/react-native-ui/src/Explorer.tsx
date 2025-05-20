import type { FC } from 'react';
import React, { useRef } from 'react';
import { Ref } from './Refs';
import type { CombinedDataset, Selection } from '@storybook/react-native-ui-common';
import { View } from 'react-native';

export interface ExplorerProps {
  isLoading: boolean;
  isBrowsing: boolean;
  dataset: CombinedDataset;
  selected: Selection;
  setSelection: (selection: Selection) => void;
}

export const Explorer: FC<ExplorerProps> = React.memo(function Explorer({
  isLoading,
  isBrowsing,
  dataset,
  selected,
  setSelection,
}) {
  const containerRef = useRef<View>(null);

  return (
    <View ref={containerRef} id="storybook-explorer-tree">
      {dataset.entries.map(([refId, ref]) => (
        <Ref
          {...ref}
          key={refId}
          isLoading={isLoading}
          isBrowsing={isBrowsing}
          selectedStoryId={selected?.refId === ref.id ? selected.storyId : null}
          setSelection={setSelection}
        />
      ))}
    </View>
  );
});
