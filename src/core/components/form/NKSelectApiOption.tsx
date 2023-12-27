import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import { AutoComplete } from 'antd';
import flat from 'flat';
import { isNull, isUndefined } from 'lodash';
import { useFormContext } from 'react-hook-form';

import NKFieldWrapper from './NKFieldWrapper';

interface NKSelectApiOptionProps {
  name: string;
  label: string;
  isShow?: boolean;
  labelClassName?: string;
  apiAction?: (value: string) => Promise<any[]>;
  fieldProps?: any;
}

const NKSelectApiOption: React.FC<NKSelectApiOptionProps> = ({
  name,
  isShow = true,
  label,
  labelClassName,
  fieldProps: { isAllOption = false, extraSelect = () => {}, ...more },
  ...rest
}) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [isDefault, setIsDefault] = React.useState(false);
  const formMethods = useFormContext();
  const optionsQuery = useQuery(
    ['options', name, searchValue],
    async () => {
      const res = await (rest.apiAction ? rest.apiAction(searchValue) : Promise.resolve([]));

      return isAllOption
        ? [
            {
              id: '',
              label: 'Tất Cả',
              name: 'Tất Cả',
            },
            ...res,
          ]
        : res;
    },
    {
      initialData: [],
    },
  );

  React.useEffect(() => {
    if (optionsQuery.data.length === 0 || isDefault) return;
    const defaultValues = formMethods.getValues(name);

    if (isNull(defaultValues) || isUndefined(defaultValues)) {
      //select first option
      setSearchValue(optionsQuery.data[0].name);
      formMethods.setValue(name, optionsQuery.data[0].id);
    } else {
      const res = optionsQuery.data.find((item) => item.id === defaultValues);
      setSearchValue(res?.name || '');
    }
    setIsDefault(true);
  }, [optionsQuery.data, isDefault]);

  const onSelect = (data: string) => {
    const res = optionsQuery.data.find((item) => item.id === data);
    setSearchValue(res?.name || '');
    formMethods.setValue(`${name}`, data, { shouldTouch: true });
    extraSelect(res, formMethods);
  };

  const onChange = (data: string) => {
    setSearchValue(data);
  };

  return (
    <NKFieldWrapper className={labelClassName} isShow={isShow} label={label} name={name}>
      <AutoComplete
        value={searchValue}
        options={optionsQuery.data.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        notFoundContent={optionsQuery.isLoading ? 'Đang tải dữ liệu' : 'Không có dữ liệu'}
        onSelect={onSelect}
        onChange={onChange}
        onBlur={() => {
          const res = optionsQuery.data.find((item) => item.name === searchValue);

          if (res) {
            setSearchValue(res.name);
          } else {
            setSearchValue('');
            setIsDefault(false);
          }
        }}
        className="w-full"
        {...more}
      />
    </NKFieldWrapper>
  );
};

export default NKSelectApiOption;
