import { useMemo, type ReactElement } from 'react';
import type {
  API_HashEntry,
  StatusValue,
  StatusesByStoryIdAndTypeId,
} from 'storybook/internal/types';

import { useTheme } from '@storybook/react-native-theming';

import { getDescendantIds } from './tree';

function CircleIcon({ height = 14, width = 14, color, ...props }: any) {
  return (
    <></>
    // <Svg width={width} height={height} viewBox="0 0 14 14" fill="none" {...props}>
    //   <Path d="M14 7A7 7 0 110 7a7 7 0 0114 0z" fill={color} />
    // </Svg>
  );
}

function SmallIcons(props: any) {
  return <CircleIcon width={6} height={6} {...props} />;
}

function LoadingIcons(props: any) {
  const theme = useTheme();

  const color = useMemo(() => {
    return theme.base === 'light' ? theme.color.mediumdark : theme.color.darker;
  }, [theme.base, theme.color.darker, theme.color.mediumdark]);

  return <SmallIcons color={color} {...props} />;
}

export const statusMapping: Record<StatusValue, [ReactElement | null, string | null]> = {
  ['status-value:unknown']: [null, null],
  ['status-value:pending']: [<LoadingIcons key="icon" />, 'currentColor'],
  ['status-value:success']: [<SmallIcons key="icon" color="green" />, 'currentColor'],
  ['status-value:warning']: [<SmallIcons key="icon" color="orange" />, '#A15C20'],
  ['status-value:error']: [<SmallIcons key="icon" color="red" />, 'brown'],
};

// export const getHighestStatus = (statuses: API_StatusValue[]): API_StatusValue => {
//   return statusPriority.reduce(
//     (acc, status) => (statuses.includes(status) ? status : acc),
//     'unknown'
//   );
// };

export const statusPriority: StatusValue[] = [
  'status-value:unknown',
  'status-value:pending',
  'status-value:success',
  'status-value:warning',
  'status-value:error',
];

export const getMostCriticalStatusValue = (statusValues: StatusValue[]): StatusValue => {
  return statusPriority.reduce(
    (acc, value) => (statusValues.includes(value) ? value : acc),
    'status-value:unknown'
  );
};

export function getGroupStatus(
  collapsedData: {
    [x: string]: Partial<API_HashEntry>;
  },
  allStatuses: StatusesByStoryIdAndTypeId
): Record<string, StatusValue> {
  return Object.values(collapsedData).reduce<Record<string, StatusValue>>((acc, item) => {
    if (item.type === 'group' || item.type === 'component') {
      const leafs = getDescendantIds(collapsedData as any, item.id, false)
        .map((id) => collapsedData[id])
        .filter((i) => i.type === 'story');

      const combinedStatus = getMostCriticalStatusValue(
        leafs.flatMap((story) => Object.values(allStatuses[story.id] || {})).map((s) => s.value)
      );

      if (combinedStatus) {
        acc[item.id] = combinedStatus;
      }
    }
    return acc;
  }, {});
}
