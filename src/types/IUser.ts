export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  storeLogo: string | null;
  avatar: string | null;
  role: string | null;
  phoneNumber: string | null;
  storeId: string | null;
}