import * as React from 'react';

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { Upload } from 'antd';
import { CompoundedComponent } from 'antd/lib/float-button/interface';
import { Controller, useFormContext } from 'react-hook-form';

import { uploadFileApi } from '@/core/api/upload-file.api';

import NKFieldWrapper from './NKFieldWrapper';

interface NKUploadImageProps {
  name: string;
  label: string;
  isShow?: boolean;
  labelClassName?: string;
  maxCount?: number;
  fieldProps?: any;
}

const NKUploadImage: React.FC<NKUploadImageProps> = ({ label, name, isShow = true, labelClassName, fieldProps = {}, ...rest }) => {
  const [imageUrl, setImageUrl] = React.useState<string>();
  const formMethods = useFormContext();

  React.useEffect(() => {
    if (!imageUrl) {
      const values = formMethods.getValues(name);
      if (values) {
        setImageUrl(values);
      }
    }
  }, [imageUrl]);

  const uploadMutation = useMutation((file: File) => {
    return uploadFileApi.v1UploadFile(file);
  });

  const uploadButton = (
    <div>
      {uploadMutation.isLoading ? <LoadingOutlined rev="" /> : <PlusOutlined rev="" />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <NKFieldWrapper className={labelClassName} isShow={isShow} label={label} name={name}>
      <Controller
        name={name}
        control={formMethods.control}
        render={({ field }) => (
          <Upload
            name={field.name}
            listType="picture-card"
            showUploadList={false}
            {...rest}
            action={async (file) => {
              const url = await uploadMutation.mutateAsync(file);
              setImageUrl(url);
              field.onChange(url);
              return url;
            }}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" className="w-full h-full" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        )}
      />
    </NKFieldWrapper>
  );
};

export default NKUploadImage;
