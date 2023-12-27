import React from 'react';

export const useBooleanWatcher = (value: any, compareValue: any): boolean => {
  const [isTrue, setIsTrue] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (value === compareValue) {
      setIsTrue(true);
    } else {
      setIsTrue(false);
    }
  }, [value, compareValue]);

  return isTrue;
};
