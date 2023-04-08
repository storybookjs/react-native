import { useEffect, useState } from 'react';

// syncs up the value of a control with the value of a story arg when resetting
// this is used for controls that don't use a controlled input like the slider
export function useResyncValue(
  value: any,
  isPristine: boolean,
  resyncCallback?: (syncValue: any) => void
) {
  const [key, setKey] = useState(0);
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    if (isPristine && value !== currentValue) {
      setKey((cur) => cur + 1);
      resyncCallback?.(value);
    }
  }, [value, currentValue, isPristine, resyncCallback]);
  return { key, setCurrentValue };
}
