import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import { AutoComplete, Select } from 'antd';
import flat from 'flat';
import { isNull, isUndefined } from 'lodash';
import { useFormContext } from 'react-hook-form';

import NKFieldWrapper from './NKFieldWrapper';

interface NKSelectMultipleApiOptionProps {
  name: string;
  label: string;
  isShow?: boolean;
  labelClassName?: string;
  apiAction?: (value: string) => Promise<any[]>;
  fieldProps?: any;
}

const NKSelectMultipleApiOption: React.FC<NKSelectMultipleApiOptionProps> = ({
  name,
  isShow = true,
  label,
  labelClassName,
  fieldProps: {},
  ...rest
}) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [isDefault, setIsDefault] = React.useState(false);
  const { setValue, getValues, register, watch } = useFormContext();
  const value = watch(name);
  const optionsQuery = useQuery(
    ['options', name, searchValue],
    async () => {
      const res = await (rest.apiAction ? rest.apiAction(searchValue) : Promise.resolve([]));

      return res;
    },
    {
      initialData: [],
    },
  );

  React.useEffect(() => {
    if (optionsQuery.data.length === 0 || isDefault) return;
    const defaultValues = getValues(name);

    if (!isNull(defaultValues) && !isUndefined(defaultValues)) {
      const valueArr = Array.isArray(defaultValues) ? defaultValues : [defaultValues];
      const valueObj = optionsQuery.data?.filter((item) => valueArr.includes(item.id));
      console.log(valueObj.map((item) => item.id));

      setValue(
        name,
        valueObj.map((item) => item.id),
      );
    }
  }, [optionsQuery.data, isDefault]);

  return (
    <NKFieldWrapper className={labelClassName} isShow={isShow} label={label} name={name}>
      <Select
        mode="multiple"
        showSearch
        allowClear
        filterOption={false}
        options={optionsQuery.data?.map((item) => ({
          value: item.id,
          label: item.name,
        }))}
        onSearch={(value) => {
          setSearchValue(value);
        }}
        {...rest}
        value={value}
        onChange={(value) => {
          setValue(name, value);
        }}
      />
    </NKFieldWrapper>
  );
};

export default NKSelectMultipleApiOption;
