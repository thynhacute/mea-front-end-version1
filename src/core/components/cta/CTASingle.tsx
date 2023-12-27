import * as React from 'react';

import { useQuery } from '@tanstack/react-query';
import joi from 'joi';

import { SingleIV1UpdateDto, singleApi } from '@/core/api/single.api';

import FormBuilder from '../form/FormBuilder';
import { NKFormType } from '../form/NKForm';

interface CTASingleProps {
  slug: string;
  scope: string;
  title: string;
  description?: string;
  isBoolean?: boolean;
}

const CTASingle: React.FC<CTASingleProps> = ({ slug, scope, isBoolean = false, title, description }) => {
  const singleQuery = useQuery(['single', scope, slug], () => {
    return singleApi.v1GetByScopeAndName(scope, slug);
  });

  if (singleQuery.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="p-4 bg-white rounded-lg shadow-xl">
      <FormBuilder<SingleIV1UpdateDto>
        apiAction={(dto) => {
          let value = dto.value;
          if (isBoolean) {
            value = dto.value ? '1' : '-1';
          }

          return singleApi.v1Put(singleQuery.data?.id || '', {
            value,
          });
        }}
        defaultValues={{
          value: singleQuery.data?.value || '',
        }}
        schema={{
          value: joi.any().required(),
        }}
        title={title}
        btnLabel="Save"
        fields={[
          {
            label: 'Value',
            name: 'value',
            type: isBoolean ? NKFormType.BOOLEAN : NKFormType.TEXT,
            span: 3,
          },
        ]}
      ></FormBuilder>
      {Boolean(description) && <div className="text-sm ">{description}</div>}
    </div>
  );
};

export default CTASingle;
