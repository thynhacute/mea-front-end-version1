import * as React from 'react';

import { Input, InputProps } from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import { Controller, useFormContext } from 'react-hook-form';

import NKFieldWrapper from './NKFieldWrapper';

const { TextArea } = Input;

interface NKTextFieldProps extends TextAreaProps {
  name: string;
  label: string;
  isShow?: boolean;
  labelClassName?: string;
  fieldProps?: any;
}

const NKTextareaField: React.FC<NKTextFieldProps> = ({ name, isShow = true, label, labelClassName, fieldProps = {}, ...rest }) => {
  const formMethods = useFormContext();

  return (
    <NKFieldWrapper className={labelClassName} isShow={isShow} label={label} name={name}>
      <Controller name={name} control={formMethods.control} render={({ field }) => <TextArea rows={4} {...field} {...rest} className="w-full" />} />
    </NKFieldWrapper>
  );
};

export default NKTextareaField;
