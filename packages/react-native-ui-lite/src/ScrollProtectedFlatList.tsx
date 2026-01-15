import * as React from 'react';
import { FlatList, FlatListProps } from 'react-native';

interface ScrollToIndexParams {
  index: number;
  animated?: boolean;
  viewOffset?: number;
  viewPosition?: number;
}

interface FlatListHandle<T> {
  scrollToIndex: (params: ScrollToIndexParams) => void;
  scrollToOffset: (params: { offset: number; animated?: boolean }) => void;
  scrollToEnd: (params?: { animated?: boolean }) => void;
}

/**
 * based on:
 * https://ignitecookbook.com/docs/recipes/UnrenderedItemInScrollView
 * This is a wrapper around React Native's FlatList that adds protection against scrolling to an
 * unknown (not rendered yet) location. This is useful for cases where the user wants to scroll to a
 * position very far down the list but we haven't rendered that far yet.
 *
 * This handles onScrollToIndexFailed so that if the scroll fails, we calculate the approximate
 * scroll position, scroll there, and then try again to get the exact position requested.
 *
 * Essentially, it's a "guess the position and retry the operation" strategy until the list is scrolled to the
 * correct location.
 */
export const ScrollProtectedFlatList = React.forwardRef<FlatListHandle<any>, FlatListProps<any>>(
  (props, forwardedRef) => {
    const internalRef = React.useRef<FlatList>(null);
    const lastScrollRequestRef = React.useRef<ScrollToIndexParams | null>(null);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(null);

    const onScrollToIndexFailed = React.useCallback(
      (info: { index: number; highestMeasuredFrameIndex: number; averageItemLength: number }) => {
        // Calculate the approximate position of the item and scroll there
        const offset = info.averageItemLength * info.index;

        try {
          internalRef.current?.scrollToOffset({ offset, animated: false });
        } catch {
          // Ignore scroll errors
        }

        // If we have a pending scroll request, retry after a short delay
        // This allows the list to render more items after the initial scroll
        if (lastScrollRequestRef.current) {
          timeoutRef.current = setTimeout(() => {
            if (lastScrollRequestRef.current && internalRef.current) {
              try {
                internalRef.current.scrollToIndex(lastScrollRequestRef.current);
              } catch {
                // Ignore - will retry via onScrollToIndexFailed if needed
              }
            }
          }, 100);
        }
      },
      []
    );

    // Clear the timeout if it still exists when the component unmounts
    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    React.useImperativeHandle(
      forwardedRef,
      () => ({
        scrollToIndex: (params: ScrollToIndexParams) => {
          lastScrollRequestRef.current = params;
          try {
            internalRef.current?.scrollToIndex(params);
          } catch {
            // Will be handled by onScrollToIndexFailed
          }
        },
        scrollToOffset: (params: { offset: number; animated?: boolean }) => {
          lastScrollRequestRef.current = null;
          try {
            internalRef.current?.scrollToOffset(params);
          } catch {
            // Ignore scroll errors
          }
        },
        scrollToEnd: (params?: { animated?: boolean }) => {
          lastScrollRequestRef.current = null;
          try {
            internalRef.current?.scrollToEnd(params);
          } catch {
            // Ignore scroll errors
          }
        },
      }),
      []
    );

    return <FlatList {...props} ref={internalRef} onScrollToIndexFailed={onScrollToIndexFailed} />;
  }
);

ScrollProtectedFlatList.displayName = 'ScrollProtectedFlatList';
