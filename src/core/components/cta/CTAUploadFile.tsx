import * as React from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { CloudUpload } from 'akar-icons';
import { Typography, Upload } from 'antd';

import { uploadFileApi } from '@/core/api/upload-file.api';

const { Paragraph } = Typography;

const { Dragger } = Upload;

interface CTAUploadFileProps {
  description?: string;
}

const CTAUploadFile: React.FC<CTAUploadFileProps> = ({ description }) => {
  const [currentUrl, setCurrentUrl] = React.useState<string>('');

  const uploadMutation = useMutation(
    (file: File) => {
      return uploadFileApi.v1UploadFile(file);
    },
    {
      onSuccess: (data) => {
        setCurrentUrl(data);
      },
    },
  );

  return (
    <div className="flex flex-col w-full">
      <Dragger
        action={async (file) => {
          const url = await uploadMutation.mutateAsync(file);

          return url;
        }}
        showUploadList={false}
      >
        {uploadMutation.isLoading ? (
          <>
            <LoadingOutlined rev="" />{' '}
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
      {currentUrl && <Paragraph copyable={{ text: currentUrl }}>{currentUrl}</Paragraph>}
    </div>
  );
};

export default CTAUploadFile;
