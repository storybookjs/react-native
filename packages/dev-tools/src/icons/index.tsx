import { FC } from 'react';
import { colors } from '../theme/colors';

export const StorybookLogo: FC<{ size?: number }> = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 50 60" fill="none">
    <path
      d="M48.831 2.81c.004.062.006.124.006.187v53.606a2.997 2.997 0 01-3.13 2.994l-40-1.796a2.997 2.997 0 01-2.86-2.882L1.002 5.724A2.997 2.997 0 013.81 2.621L36.609.57l-.285 6.756a.447.447 0 00.05.223l.04.066c.15.196.43.235.627.085l2.623-1.99 2.217 1.746a.447.447 0 00.723-.367L42.356.211l3.298-.205A2.997 2.997 0 0148.83 2.81z"
      fill="#FF4785"
    />
    <path
      d="M35.324 7.326L35.61.569l5.746-.36.248 6.88a.447.447 0 01-.723.367L38.664 5.71 36.041 7.7a.447.447 0 01-.717-.374z"
      fill="#FFF"
    />
    <path
      d="M27.975 22.464c0 1.166 7.853.607 8.907-.212 0-7.939-4.26-12.11-12.06-12.11-7.801 0-12.172 4.236-12.172 10.591 0 11.069 14.938 11.28 14.938 17.318 0 1.695-.83 2.7-2.656 2.7-2.379 0-3.32-1.214-3.209-5.345 0-.896-9.073-1.175-9.35 0-.704 10.01 5.533 12.898 12.67 12.898 6.915 0 12.337-3.686 12.337-10.36 0-11.862-15.159-11.544-15.159-17.423 0-2.383 1.77-2.7 2.822-2.7 1.106 0 3.098.194 2.932 4.643z"
      fill="#FFF"
    />
  </svg>
);

export const ComponentIcon: FC<{ color?: string }> = ({ color = colors.secondary }) => (
  <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.5.004a2.5 2.5 0 00-2.5 2.5v7a2.5 2.5 0 002.5 2.5h7a2.5 2.5 0 002.5-2.5v-7a2.5 2.5 0 00-2.5-2.5h-7zm8.5 5.5H6.5v-4.5h3a1.5 1.5 0 011.5 1.5v3zm0 1v3a1.5 1.5 0 01-1.5 1.5h-3v-4.5H11zm-5.5 4.5v-4.5H1v3a1.5 1.5 0 001.5 1.5h3zM1 5.504h4.5v-4.5h-3a1.5 1.5 0 00-1.5 1.5v3z"
      fill={color}
    />
  </svg>
);

export const StoryIcon: FC<{ color?: string }> = ({ color = colors.seafoam }) => (
  <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 0h6c.237 0 .428.192.428.429V11.57c0 .224-.17.407-.389.427a.396.396 0 01-.318-.101L6 9.565l-2.721 2.332a.395.395 0 01-.325.1.429.429 0 01-.383-.426V.43C2.571.192 2.763 0 3 0zm.428 10.64l2.284-1.958.034-.028a.39.39 0 01.289-.081c.087.007.172.04.244.102L8.57 10.64V.857H3.428v9.783z"
      fill={color}
    />
  </svg>
);

export const GroupIcon: FC<{ color?: string }> = ({ color = colors.purple }) => (
  <svg width={14} height={14} viewBox="0 0 15 15" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.962 3.704L5.376 2.118H1.057v9.514h12.685V3.704h-6.78zM7.4 2.647L6.124 1.37a1.057 1.057 0 00-.748-.31H.53A.529.529 0 000 1.59v10.57c0 .292.237.529.529.529H14.27a.529.529 0 00.528-.529V3.175a.529.529 0 00-.528-.528H7.4z"
      fill={color}
    />
  </svg>
);

export const SearchIcon: FC<{ color?: string }> = ({ color = colors.mediumdark }) => (
  <svg width={14} height={14} viewBox="0 0 14 14" fill={color}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.544 10.206a5.5 5.5 0 11.662-.662.5.5 0 01.148.102l3 3a.5.5 0 01-.708.708l-3-3a.5.5 0 01-.102-.148zM10.5 6a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
    />
  </svg>
);

export const ChevronIcon: FC<{ isExpanded?: boolean; color?: string }> = ({
  isExpanded,
  color = colors.textMutedColor,
}) => (
  <svg
    width={8}
    height={8}
    viewBox="0 0 8 8"
    fill="none"
    style={{
      transform: isExpanded ? 'rotate(90deg)' : 'none',
      transition: 'transform 0.1s ease-out',
    }}
  >
    <path
      fill={color}
      d="M1.896 7.146a.5.5 0 10.708.708l3.5-3.5a.5.5 0 000-.708l-3.5-3.5a.5.5 0 10-.708.708L5.043 4 1.896 7.146z"
    />
  </svg>
);

export const ExpandAllIcon: FC<{ color?: string }> = ({ color = colors.textColor }) => (
  <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <path
      d="M7.354.146l4 4a.5.5 0 01-.708.708L7 1.207 3.354 4.854a.5.5 0 11-.708-.708l4-4a.5.5 0 01.708 0zM11.354 9.146a.5.5 0 010 .708l-4 4a.5.5 0 01-.708 0l-4-4a.5.5 0 11.708-.708L7 12.793l3.646-3.647a.5.5 0 01.708 0z"
      fill={color}
    />
  </svg>
);

export const CollapseAllIcon: FC<{ color?: string }> = ({ color = colors.textColor }) => (
  <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <path
      d="M3.354.146a.5.5 0 10-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 00-.708-.708L7 3.793 3.354.146zM6.646 9.146a.5.5 0 01.708 0l4 4a.5.5 0 01-.708.708L7 10.207l-3.646 3.647a.5.5 0 01-.708-.708l4-4z"
      fill={color}
    />
  </svg>
);

export const CloseIcon: FC<{ color?: string }> = ({ color = colors.textMutedColor }) => (
  <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <path
      d="M9.854 4.146a.5.5 0 010 .708L7.707 7l2.147 2.146a.5.5 0 01-.708.708L7 7.707 4.854 9.854a.5.5 0 01-.708-.708L6.293 7 4.146 4.854a.5.5 0 11.708-.708L7 6.293l2.146-2.147a.5.5 0 01.708 0z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 14A7 7 0 107 0a7 7 0 000 14zm0-1A6 6 0 107 1a6 6 0 000 12z"
      fill={color}
    />
  </svg>
);

export const SettingsIcon: FC<{ color?: string }> = ({ color = colors.textMutedColor }) => (
  <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 4.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM5.5 7a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
      fill={color}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 0a.5.5 0 01.5.5v1.02a5.5 5.5 0 011.933.8l.72-.72a.5.5 0 01.708.708l-.72.72a5.5 5.5 0 01.8 1.933H12a.5.5 0 010 1h-1.059a5.5 5.5 0 01-.8 1.933l.72.72a.5.5 0 01-.708.708l-.72-.72a5.5 5.5 0 01-1.933.8V12a.5.5 0 01-1 0v-1.059a5.5 5.5 0 01-1.933-.8l-.72.72a.5.5 0 01-.708-.708l.72-.72a5.5 5.5 0 01-.8-1.933H2a.5.5 0 010-1h1.059a5.5 5.5 0 01.8-1.933l-.72-.72a.5.5 0 11.708-.708l.72.72a5.5 5.5 0 011.933-.8V.5A.5.5 0 017 0zm0 2.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
      fill={color}
    />
  </svg>
);
