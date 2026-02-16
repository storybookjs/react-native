import { ReactNode, useEffect } from 'react';
import { PARAM_KEY } from './constants';
import type { Args } from 'storybook/internal/types';

interface ContainerProps {
  initialBackground: string;
  globals: Args;
  updateGlobals: (newGlobals: Args) => void;
  children: ReactNode;
}

const Container = ({ initialBackground, globals, updateGlobals, children }: ContainerProps) => {
  const globalsBackground = globals[PARAM_KEY]?.value;

  useEffect(() => {
    if (globalsBackground == null && initialBackground !== 'transparent') {
      updateGlobals({ [PARAM_KEY]: { value: initialBackground } });
    }
  }, [initialBackground, globalsBackground, updateGlobals]);

  return children;
};

export default Container;
