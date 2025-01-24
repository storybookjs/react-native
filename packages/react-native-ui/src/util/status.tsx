import { useMemo, type ReactElement } from 'react';
import type { API_HashEntry, API_StatusState, API_StatusValue } from '@storybook/core/types';

import { useTheme } from '@storybook/react-native-theming';

import { getDescendantIds } from './tree';

import Svg, { Path, SvgProps } from 'react-native-svg';

function CircleIcon({ height = 14, width = 14, color, ...props }: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 14" fill="none" {...props}>
      <Path d="M14 7A7 7 0 110 7a7 7 0 0114 0z" fill={color} />
    </Svg>
  );
}

function SmallIcons(props: SvgProps) {
  return <CircleIcon width={6} height={6} {...props} />;
}

function LoadingIcons(props: SvgProps) {
  const theme = useTheme();

  const color = useMemo(() => {
    return theme.base === 'light' ? theme.color.mediumdark : theme.color.darker;
  }, [theme.base, theme.color.darker, theme.color.mediumdark]);

  return <SmallIcons color={color} {...props} />;
}

export const statusPriority: API_StatusValue[] = ['unknown', 'pending', 'success', 'warn', 'error'];
export const statusMapping: Record<API_StatusValue, [ReactElement | null, string | null]> = {
  unknown: [null, null],
  pending: [<LoadingIcons key="icon" />, 'currentColor'],
  success: [<SmallIcons key="icon" color="green" />, 'currentColor'],
  warn: [<SmallIcons key="icon" color="orange" />, '#A15C20'],
  error: [<SmallIcons key="icon" color="red" />, 'brown'],
};

export const getHighestStatus = (statuses: API_StatusValue[]): API_StatusValue => {
  return statusPriority.reduce(
    (acc, status) => (statuses.includes(status) ? status : acc),
    'unknown'
  );
};

export function getGroupStatus(
  collapsedData: {
    [x: string]: Partial<API_HashEntry>;
  },
  status: API_StatusState
): Record<string, API_StatusValue> {
  return Object.values(collapsedData).reduce<Record<string, API_StatusValue>>((acc, item) => {
    if (item.type === 'group' || item.type === 'component') {
      const leafs = getDescendantIds(collapsedData as any, item.id, false)
        .map((id) => collapsedData[id])
        .filter((i) => i.type === 'story');

      const combinedStatus = getHighestStatus(
        leafs.flatMap((story) => Object.values(status?.[story.id] || {})).map((s) => s.status)
      );

      if (combinedStatus) {
        acc[item.id] = combinedStatus;
      }
    }
    return acc;
  }, {});
}
