'use client';

import * as React from 'react';

import dynamic from 'next/dynamic';

import { Controller, useFormContext } from 'react-hook-form';
import { QuillOptions } from 'react-quill';

import NKFieldWrapper from './NKFieldWrapper';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface NKRichTextProps extends QuillOptions {
  name: string;
  label: string;
  isShow?: boolean;
  labelClassName?: string;
  fieldProps?: any;
}

const NKRichText: React.FC<NKRichTextProps> = ({ name, isShow = true, label, labelClassName, fieldProps = {}, ...rest }) => {
  const formMethods = useFormContext();

  return (
    <NKFieldWrapper className={labelClassName} isShow={isShow} label={label} name={name}>
      <Controller name={name} control={formMethods.control} render={({ field }) => <ReactQuill {...field} {...rest} className="w-full" />} />
    </NKFieldWrapper>
  );
};

export default NKRichText;
