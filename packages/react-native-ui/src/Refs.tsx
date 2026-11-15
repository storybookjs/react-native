import type { FC } from 'react';
import React, { useMemo, useCallback, useEffect, useState } from 'react';
import type { State } from 'storybook/manager-api';
import { styled } from '@storybook/react-native-theming';
import { Tree } from './Tree';
import type { RefType } from '@storybook/react-native-ui-common';
import { getStateType } from '@storybook/react-native-ui-common';

export interface RefProps {
  isLoading: boolean;
  isBrowsing: boolean;
  selectedStoryId: string | null;
  setSelection: (selection: { refId: string; storyId: string }) => void;
}

const Wrapper = styled.View<{ isMain: boolean }>(() => ({
  position: 'relative',
}));

export const Ref: FC<RefType & RefProps & { status?: State['status'] }> = React.memo(
  function Ref(props) {
    const {
      index,
      id: refId,
      title = refId,
      isLoading: isLoadingMain,
      isBrowsing,
      selectedStoryId,
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
      },
      [refId, setSelection]
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
                docsMode={false}
                selectedStoryId={selectedStoryId}
                onSelectStoryId={onSelectStoryId}
              />
            )}
          </Wrapper>
        )}
      </>
    );
  }
);
