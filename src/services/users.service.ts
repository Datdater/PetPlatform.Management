import { IUser } from "../types/IUser";
import { client } from "./clients";

const fetchUsers = async () => {
  const response = await client.get<IUser[]>("/users");
  return response.data;
};

const fetchUser = async (id: number) => {
  const response = await client.get<IUser>(`/users/${id}`);
  return response.data;
};

const addUser = async (user: IUser) => {
  const response = await client.post<IUser>("/users", user);
  return response.data;
};

export { fetchUsers, fetchUser, addUser };
