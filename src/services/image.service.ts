import { AxiosResponse } from "axios";
import { client } from "./clients";

interface IUploadImageResponse {
  url: string; // The URL of the uploaded image
}
const BASE_URL = '/Image';
export const uploadImage = async (file: File): Promise<IUploadImageResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const response: AxiosResponse<IUploadImageResponse> = await client.post(
    BASE_URL,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

