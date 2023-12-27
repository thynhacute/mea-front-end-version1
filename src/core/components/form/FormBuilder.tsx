import * as React from 'react';

import { joiResolver } from '@hookform/resolvers/joi';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'antd';
import joi from 'joi';
import { kebabCase } from 'lodash';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { toastError } from '@/core/utils/api.helper';

import NKForm, { NKFormType } from './NKForm';
import NKFormWrapper from './NKFormWrapper';

interface FormBuilderItem {
  name: string;
  label: string;
  type: NKFormType;
  span: 1 | 2 | 3;
  fieldProps?: any;
  isShow?: (value: any) => boolean;
  useAction?: (value: any) => any;
}

interface FormBuilderProps<T> {
  title: string;
  apiAction: (value: T) => Promise<any>;
  fields: FormBuilderItem[];
  defaultValues: T;
  schema?: Record<keyof T, joi.AnySchema>;
  btnLabel?: string;
  onExtraSuccessAction?: (data: any) => void;
  onExtraErrorAction?: (data: any) => void;
  isDebug?: boolean;
  setFormMethods?: (formMethods: any) => void;
}

const FormBuilder = <T,>({
  fields,
  title,
  apiAction,
  schema,
  defaultValues,
  onExtraSuccessAction,
  onExtraErrorAction,
  btnLabel = 'Submit',
  isDebug,
  setFormMethods,
}: FormBuilderProps<T>) => {
  const formMethods = useForm<any>({
    resolver: schema ? joiResolver(joi.object(schema)) : undefined,
    defaultValues,
  });
  const watchValues = formMethods.watch();

  React.useEffect(() => {
    if (setFormMethods) {
      setFormMethods(formMethods);
    }
  }, []);

  const mutate = useMutation(apiAction, {
    onSuccess: (data) => {
      toast.success('Thực hiện thành công');
      onExtraSuccessAction?.(data);
    },
    onError: (error: any) => {
      toastError(error.data);
      onExtraErrorAction?.(error);
    },
  });

  React.useEffect(() => {
    if (isDebug) {
      console.log('FormBuilder', formMethods.getValues());
      console.log('FormBuilder', formMethods.formState.errors);
    }
  }, [formMethods.getValues()]);

  return (
    <form
      className="flex flex-col gap-4 p-4 bg-white rounded-lg fade-in"
      onSubmit={formMethods.handleSubmit((value) => {
        mutate.mutate(value);
      })}
    >
      <div className="col-span-1 sr-only"></div>
      <div className="col-span-2 sr-only"></div>
      <div className="col-span-3 sr-only"></div>
      <div className="text-xl font-bold">{title}</div>
      <NKFormWrapper formMethods={formMethods} formActionError={mutate.error}>
        <div className="grid grid-cols-3 gap-4">
          {fields
            .filter((item) => (item.isShow ? item.isShow(watchValues) : true))
            .map((item) => {
              return (
                <div key={kebabCase(`${item.name}-${item.label}`)} className={`col-span-${item.span} `}>
                  <NKForm label={item.label} name={item.name} type={item.type} apiAction={item.useAction} fieldProps={item.fieldProps} />
                </div>
              );
            })}
        </div>
      </NKFormWrapper>
      <Button type="primary" htmlType="submit" loading={mutate.isLoading}>
        {btnLabel}
      </Button>
    </form>
  );
};

export default FormBuilder;
