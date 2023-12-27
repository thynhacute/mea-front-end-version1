import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import { AutoComplete } from 'antd';
import flat from 'flat';
import { isNull, isUndefined } from 'lodash';
import { useFormContext } from 'react-hook-form';

import NKFieldWrapper from './NKFieldWrapper';

interface NKAutoCompleteApiOptionProps {
  name: string;
  label: string;
  isShow?: boolean;
  labelClassName?: string;
  apiAction?: (value: string) => Promise<any[]>;
  fieldProps?: any;
}

const NKAutoCompleteApiOption: React.FC<NKAutoCompleteApiOptionProps> = ({
  name,
  isShow = true,
  label,
  labelClassName,
  fieldProps: { extraSelectAction: extraSelectAction = () => {} },

  ...rest
}) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [isDefault, setIsDefault] = React.useState(false);
  const { setValue, getValues } = useFormContext();
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

    if (isNull(defaultValues) || isUndefined(defaultValues)) {
      //select first option
      setSearchValue(optionsQuery.data[0].name);
      setValue(name, optionsQuery.data[0].id);
    } else {
      console.log('defaultValues', defaultValues);
      setSearchValue(defaultValues);
    }
    setIsDefault(true);
  }, [optionsQuery.data, isDefault]);

  const onSelect = (data: string) => {
    const res = optionsQuery.data.find((item) => item.id === data);
    setSearchValue(res?.name || '');
    setValue(`${name}`, res?.name, { shouldTouch: true });
    extraSelectAction?.(res);
  };

  const onChange = (data: string) => {
    setSearchValue(data);

    setValue(`${name}`, data, { shouldTouch: true });
  };

  return (
    <NKFieldWrapper className={labelClassName} isShow={isShow} label={label} name={name}>
      <AutoComplete
        value={searchValue}
        options={optionsQuery.data.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
        onSelect={onSelect}
        onChange={onChange}
        className="w-full"
      />
    </NKFieldWrapper>
  );
};

export default NKAutoCompleteApiOption;
