import * as React from 'react';

import { InputProps } from 'antd';
import { useFormContext } from 'react-hook-form';

import NKFieldWrapper from './NKFieldWrapper';

interface NKWatchDisplayProps extends InputProps {
  name: string;
  label: string;
  isShow?: boolean;
  labelClassName?: string;

  apiAction?: (value: any) => React.ReactNode;
}

const NKWatchDisplay: React.FC<NKWatchDisplayProps> = ({ name, isShow = true, label, labelClassName, apiAction, ...rest }) => {
  const formMethods = useFormContext();
  const watchValue = formMethods.watch(name);

  return (
    <NKFieldWrapper className={labelClassName} isShow={isShow} label={label} name={name}>
      {apiAction ? apiAction(watchValue) : <div>{watchValue}</div>}
    </NKFieldWrapper>
  );
};

export default NKWatchDisplay;
