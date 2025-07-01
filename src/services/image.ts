import { feClient } from './clients';


export const saveImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await feClient.post(`/image`, formData);
  return response.data;
};
