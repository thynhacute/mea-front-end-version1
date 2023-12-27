import * as React from 'react';

import { InputNumber, InputNumberProps } from 'antd';
import _ from 'lodash';
import { Controller, useFormContext } from 'react-hook-form';

import NKFieldWrapper from './NKFieldWrapper';

interface NKInputNumberProps extends InputNumberProps {
  name: string;
  label: string;
  isShow?: boolean;
  labelClassName?: string;
  fieldProps?: any;
}

const NKInputNumber: React.FC<NKInputNumberProps> = ({ name, isShow = true, label, labelClassName, fieldProps = {}, ...rest }) => {
  const formMethods = useFormContext();

  return (
    <NKFieldWrapper className={labelClassName} isShow={isShow} label={label} name={name}>
      <Controller
        name={name}
        control={formMethods.control}
        render={({ field }) => (
          <InputNumber
            {...field}
            {...rest}
            {...fieldProps}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            className="w-full"
          />
        )}
      />
    </NKFieldWrapper>
  );
};

export default NKInputNumber;
