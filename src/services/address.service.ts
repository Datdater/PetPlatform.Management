import axios from "axios";

export interface IProvince {
  _id: string;
  name: string;
  slug: string;
  type: string;
  name_with_type: string;
  code: string;
  isDeleted: boolean;
}

export interface IDistrict {
  _id: string;
  name: string;
  type: string;
  slug: string;
  name_with_type: string;
  path: string;
  path_with_type: string;
  code: string;
  parent_code: string;
  isDeleted: boolean;
}

export interface IWard {
  _id: string;
  name: string;
  type: string;
  slug: string;
  name_with_type: string;
  path: string;
  path_with_type: string;
  code: string;
  parent_code: string;
  isDeleted: boolean;
}

const addressApi = axios.create({
  baseURL: "https://vn-public-apis.fpo.vn",
  headers: {
    "Content-Type": "application/json",
  },
});

const fetchProvince = async () => {
  const response = await addressApi.get<{ data: { data: IProvince[] } }>(
    `provinces/getAll?limit=-1`
  );
  return response.data.data.data;
};

const fetchDistrict = async (provinceCode: string) => {
  const response = await addressApi.get<{ data: { data: IDistrict[] } }>(
    `districts/getByProvince?provinceCode=${provinceCode}&limit=-1`
  );
  return response.data.data.data;
};

const fetchWard = async (districtCode: string) => {
  const response = await addressApi.get<{ data: { data: IWard[] } }>(
    `wards/getByDistrict?districtCode=${districtCode}&limit=-1`
  );
  return response.data.data.data;
};

export { fetchProvince, fetchDistrict, fetchWard };
