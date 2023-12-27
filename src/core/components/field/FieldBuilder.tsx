import * as React from 'react';

import { Descriptions } from 'antd';
import _get from 'lodash/get';

import { NKFormType } from '../form/NKForm';
import FieldDisplay, { FieldType } from './FieldDisplay';

interface FieldBuilderItem {
  key: string;
  label: string;
  type: FieldType;
  span: 1 | 2 | 3;
  apiAction?: () => Promise<any[]>;
}

interface FieldBuilderProps<T> {
  title: string;
  fields: FieldBuilderItem[];
  record: T | undefined;
  extra?: React.ReactNode;
  isLoading?: boolean;
  size?: 'small' | 'default' | 'middle';
}

const FieldBuilder = <T,>({ fields, title, record, extra, isLoading, size = 'default' }: FieldBuilderProps<T>) => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg fade-in">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="col-span-1 sr-only"></div>
          <div className="col-span-2 sr-only"></div>
          <div className="col-span-3 sr-only"></div>
          <div className="flex items-end justify-between gap-4">
            <div className="text-xl font-bold text-black">{title}</div>
            {extra}
          </div>
          <Descriptions bordered size={size}>
            {fields.map((item) => {
              return (
                <Descriptions.Item key={item.key} label={item.label} span={item.span}>
                  <FieldDisplay type={item.type} value={_get(record, item.key)} apiAction={item.apiAction} />
                </Descriptions.Item>
              );
            })}
          </Descriptions>
        </>
      )}
    </div>
  );
};

export default FieldBuilder;
