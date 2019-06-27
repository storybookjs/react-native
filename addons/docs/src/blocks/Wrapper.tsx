import React from 'react';

interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper: React.FunctionComponent<WrapperProps> = ({ children }) => (
  <div style={{ fontFamily: 'sans-serif' }}>{children}</div>
);
