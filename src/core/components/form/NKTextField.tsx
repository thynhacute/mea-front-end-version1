import * as React from 'react';

import { Input, InputProps } from 'antd';
import { Controller, useFormContext } from 'react-hook-form';

import NKFieldWrapper from './NKFieldWrapper';

interface NKTextFieldProps extends InputProps {
  name: string;
  label: string;
  isShow?: boolean;
  labelClassName?: string;
  fieldProps?: any;
}

const NKTextField: React.FC<NKTextFieldProps> = ({ name, isShow = true, label, labelClassName, fieldProps = {}, ...rest }) => {
  const formMethods = useFormContext();

  return (
    <NKFieldWrapper className={labelClassName} isShow={isShow} label={label} name={name}>
      <Controller
        name={name}
        control={formMethods.control}
        render={({ field }) => <Input {...field} {...rest} className="w-full disabled:!bg-white disabled:!text-black" {...fieldProps} />}
      />
    </NKFieldWrapper>
  );
};

export default NKTextField;
