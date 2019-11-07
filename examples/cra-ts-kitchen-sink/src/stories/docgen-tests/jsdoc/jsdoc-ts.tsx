import React, { FC, SyntheticEvent } from 'react';

interface TSProps {
  /**
   * this is case 1.
   * @param { SyntheticEvent } event - React's original event.
   * @returns {void}
   */
  case1: (event: SyntheticEvent) => void;
  /**
   * should not be visible since it's ignored.
   * @ignore
   */
  case2: string;
}

/**
 * Button functional component (React.FC)
 */
export const TypeScriptProps: FC<TSProps> = ({ case1, case2 }) => (
  <button type="button" onClick={case1}>
    JSDoc with TypeScript! {case2}
  </button>
);
