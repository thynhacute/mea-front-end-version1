import * as React from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { CloudUpload } from 'akar-icons';
import { Typography, Upload } from 'antd';

import { uploadFileApi } from '@/core/api/upload-file.api';

const { Paragraph } = Typography;

const { Dragger } = Upload;

interface CTAUploadActionProps {
  description?: string;
  apiAction: (file: File) => Promise<any>;
  onExtraSuccessAction?: (data: any) => void;
  onExtraErrorAction?: (data: any) => void;
}

const CTAUploadAction: React.FC<CTAUploadActionProps> = ({ description, apiAction, onExtraErrorAction, onExtraSuccessAction }) => {
  const uploadMutation = useMutation(
    (file: File) => {
      return apiAction(file);
    },
    {
      onSuccess: (data) => {
        onExtraSuccessAction?.(data);
      },
      onError: (error: any) => {
        onExtraErrorAction?.(error);
      },
    },
  );

  return (
    <div className="flex flex-col w-full">
      <Dragger
        action={async (file) => {
          await uploadMutation.mutate(file);
          return '';
        }}
        showUploadList={false}
      >
        {uploadMutation.isLoading ? (
          <>
            <LoadingOutlined rev="" />
          </>
        ) : (
          <div className="p-4">
            <p className="ant-upload-drag-icon">
              <CloudUpload strokeWidth={2} size={36} />
            </p>
            <p className="ant-upload-text">Chọn hoặc kéo thả file vào đây</p>
            <p className="ant-upload-hint">{description}</p>
          </div>
        )}
      </Dragger>
    </div>
  );
};

export default CTAUploadAction;
