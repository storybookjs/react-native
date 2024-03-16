import type { FC } from 'react';
import React, { useRef } from 'react';

import { Ref } from './Refs';
import type { CombinedDataset, Selection } from './types';

// import { useHighlighted } from './useHighlighted';
// import { HighlightStyles } from './HighlightStyles';
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

  // Track highlighted nodes, keep it in sync with props and enable keyboard navigation
  //   const [highlighted, setHighlighted, highlightedRef] = useHighlighted({
  //     containerRef,
  //     isLoading,
  //     isBrowsing,
  //     dataset,
  //     selected,
  //   });

  return (
    <View ref={containerRef} id="storybook-explorer-tree">
      {/* {highlighted && <HighlightStyles {...highlighted} />} */}
      {dataset.entries.map(([refId, ref]) => (
        <Ref
          {...ref}
          key={refId}
          isLoading={isLoading}
          isBrowsing={isBrowsing}
          selectedStoryId={/* selected?.refId === ref.id ? */ selected.storyId /* : null */}
          setSelection={setSelection}
          //   highlightedRef={highlightedRef}
          //   setHighlighted={setHighlighted}
        />
      ))}
    </View>
  );
});
