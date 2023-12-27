import http from './http';

export const uploadFileApi = {
  v1UploadFile: async (file: File | Blob) => {
    const url = '/v1/upload-file/upload';
    const formData = new FormData();
    formData.append('file', file);
    const res = await http.post<any>(url, formData);
    return res.data.fileLocation;
  },
};
