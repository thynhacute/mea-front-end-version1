import * as React from 'react';

import { Input, InputProps, SwitchProps } from 'antd';
import { Switch } from 'antd/lib';
import { Controller, useFormContext } from 'react-hook-form';

import NKFieldWrapper from './NKFieldWrapper';

interface NKBooleanInputProps extends SwitchProps {
  name: string;
  label: string;
  isShow?: boolean;
  labelClassName?: string;
  fieldProps?: any;
}

const NKBooleanInput: React.FC<NKBooleanInputProps> = ({ name, isShow = true, label, labelClassName, fieldProps = {}, ...rest }) => {
  const formMethods = useFormContext();

  return (
    <NKFieldWrapper className={labelClassName} isShow={isShow} label={label} name={name}>
      <div>
        <Controller
          name={name}
          control={formMethods.control}
          render={({ field }) => <Switch {...field} checked={field.value} {...rest} className="" />}
        />
      </div>
    </NKFieldWrapper>
  );
};

export default NKBooleanInput;
