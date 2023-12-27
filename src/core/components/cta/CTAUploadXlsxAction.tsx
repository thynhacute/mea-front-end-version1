import * as React from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { CloudUpload } from 'akar-icons';
import { Typography, Upload } from 'antd';
import _get from 'lodash/get';
import { toast } from 'react-toastify';

import { NKConfig } from '@/core/NKConfig';
import { uploadFileApi } from '@/core/api/upload-file.api';
import { XLSXIncorrectItem } from '@/core/models/xlsx';

const { Paragraph } = Typography;

const { Dragger } = Upload;

interface CTAUploadXlsxActionProps {
  description?: string;
  apiAction: (file: File) => Promise<any>;
  onExtraSuccessAction?: (data: any) => void;
  onExtraErrorAction?: (data: any) => void;
}

const CTAUploadXlsxAction: React.FC<CTAUploadXlsxActionProps> = ({ description, apiAction, onExtraErrorAction, onExtraSuccessAction }) => {
  const [incorrectData, setIncorrectData] = React.useState<XLSXIncorrectItem<any>[]>([]);
  const [correctData, setCorrectData] = React.useState<any[]>([]);
  const [isIncorrect, setIsIncorrect] = React.useState(false);
  const [errorPath, setErrorPath] = React.useState<string>('');
  const [path, setPath] = React.useState('');

  const uploadMutation = useMutation(
    (file: File) => {
      setIncorrectData([]);
      setCorrectData([]);
      setIsIncorrect(false);
      setPath('');
      return apiAction(file);
    },
    {
      onSuccess: (data) => {
        onExtraSuccessAction?.(data);
        const isIncorrectData = _get(data, 'isIncorrectData', false);
        setIsIncorrect(isIncorrectData);
        const incorrectData = _get(data, 'incorrectData', []);
        setIncorrectData(incorrectData);
        const correctData = _get(data, 'correctData', []);
        setCorrectData(correctData);
        const link = NKConfig.API_URL + _get(data, 'path', '');
        setPath(link);
        const rtfPath = _get(data, 'rtfPath', '');
        setErrorPath(rtfPath);

        if (!isIncorrectData) {
          setIncorrectData([]);
          toast.success('Tải file thành công');
        }
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
      {(correctData.length > 0 || incorrectData.length > 0) && (
        <div className="mt-2">
          <div className="font-semibold text-black">Kết quả tải file</div>
          <div className="">
            <div className="grid-cols-[150px_50px] grid">
              Thành công:
              <span className="font-semibold text-green-500">{correctData.length}</span>
            </div>
            <div className="grid-cols-[150px_50px] grid">
              Thất bại:
              <span className="font-semibold text-red-500">{incorrectData.length}</span>
            </div>
          </div>
        </div>
      )}

      {isIncorrect && (
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-red-500">Lỗi file excel tại các hàng:</div>
            <div className="flex gap-4">
              <a className="font-medium text-black underline" href={path} download="error.xlsx">
                Tải file XLSX lỗi
              </a>
            </div>
          </div>
          <div className="mt-2 text-sm">
            {incorrectData.slice(0, 3).map((item, index) => {
              return (
                <div>
                  <span className="font-medium">Hàng {item.data.index + 1}</span>:{' '}
                  {item.errors.map((error) => `${error.column} ${error.message}`).join(', ')}
                </div>
              );
            })}
            {Boolean(errorPath) && (
              <a className="font-medium text-blue-500 underline cursor-pointer" href={NKConfig.API_URL + errorPath} download="error.docx">
                Hướng dẫn sửa lỗi
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CTAUploadXlsxAction;
