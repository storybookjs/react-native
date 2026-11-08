import { ReactNode } from 'react';

interface AddonPanelProps {
  active?: boolean;
  children: ReactNode;
}

export const AddonPanel = ({ children }: AddonPanelProps) => {
  return <>{children}</>;
};

AddonPanel.displayName = 'AddonPanel';
