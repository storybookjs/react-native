import type { FC } from 'react';
import React, { useMemo, useCallback, useEffect, useState } from 'react';
import type { State } from '@storybook/manager-api';
import { useStorybookApi, useStorybookState } from '@storybook/manager-api';
import { styled } from '@storybook/react-native-theming';
// import { transparentize } from 'polished';

// import { AuthBlock, ErrorBlock, LoaderBlock, EmptyBlock } from './RefBlocks';

// import { RefIndicator } from './RefIndicator';

import { Tree } from './Tree';

import type { RefType } from './types';
import { getStateType } from './util/tree';
import { DEFAULT_REF_ID } from './constants';

// import { CollapseIcon } from './icon/CollapseIcon';

// import { getStateType } from '../../utils/tree';
// import { CollapseIcon } from './components/CollapseIcon';

export interface RefProps {
  isLoading: boolean;
  isBrowsing: boolean;
  selectedStoryId: string | null;
  setSelection: (selection: { refId: string; storyId: string }) => void;
  //   highlightedRef: MutableRefObject<Highlight>;
  //   setHighlighted: (highlight: Highlight) => void;
}

const Wrapper = styled.View<{ isMain: boolean }>(({}) => ({
  position: 'relative',
}));

// const RefHead = styled.View(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   background: 'transparent',

//   width: '100%',
//   marginTop: 20,
//   paddingTop: 16,
//   paddingBottom: 12,
//   borderTopColor: theme.appBorderColor,
//   borderTopWidth: 1,
// }));

// const RefTitle = styled.Text(({ theme }) => ({
//   //   textOverflow: 'ellipsis',
//   //   whiteSpace: 'nowrap',
//   flex: 1,
//   flexDirection: 'row',
//   overflow: 'hidden',
//   marginLeft: 2,
//   fontWeight: theme.typography.weight.bold,
//   fontSize: theme.typography.size.s2,
//   lineHeight: 16,
//   color:
//     theme.base === 'light' ? theme.color.defaultText : transparentize(0.2, theme.color.defaultText),
// }));

// const CollapseButton = styled.TouchableOpacity(({}) => ({
//   display: 'flex',
//   flexDirection: 'row',
//   paddingVertical: 0,
//   paddingHorizontal: 8,
//   gap: 6,
//   alignItems: 'center',
//   cursor: 'pointer',
//   overflow: 'hidden',
// }));

export const Ref: FC<RefType & RefProps & { status?: State['status'] }> = React.memo(function Ref(
  props
) {
  const { docsOptions } = useStorybookState();
  const api = useStorybookApi();
  const {
    index,
    id: refId,
    title = refId,
    isLoading: isLoadingMain,
    isBrowsing,
    selectedStoryId,
    // highlightedRef,
    // setHighlighted,
    loginUrl,
    type,
    expanded = true,
    indexError,
    previewInitialized,
    setSelection,
  } = props;
  const length = useMemo(() => (index ? Object.keys(index).length : 0), [index]);

  const isLoadingInjected =
    (type === 'auto-inject' && !previewInitialized) || type === 'server-checked';
  const isLoading = isLoadingMain || isLoadingInjected || type === 'unknown';
  const isError = !!indexError;
  const isEmpty = !isLoading && length === 0;
  const isAuthRequired = !!loginUrl && length === 0;

  const state = getStateType(isLoading, isAuthRequired, isError, isEmpty);
  const [isExpanded, setExpanded] = useState<boolean>(expanded);

  useEffect(() => {
    if (index && selectedStoryId && index[selectedStoryId]) {
      setExpanded(true);
    }
  }, [setExpanded, index, selectedStoryId]);

  const onSelectStoryId = useCallback(
    (storyId: string) => {
      setSelection({ refId, storyId });
      return api && api.selectStory(storyId, DEFAULT_REF_ID);
    },
    [api, refId, setSelection]
  );

  return (
    <>
      {isExpanded && (
        <Wrapper data-title={title} isMain={true}>
          {state === 'ready' && (
            <Tree
              status={props.status}
              isBrowsing={isBrowsing}
              isMain={true}
              refId={refId}
              data={index}
              docsMode={docsOptions?.docsMode}
              selectedStoryId={selectedStoryId}
              onSelectStoryId={onSelectStoryId}
            />
          )}
        </Wrapper>
      )}
    </>
  );
});
