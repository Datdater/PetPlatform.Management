import { Spin } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import React from "react";
import useFetchUsers from "../../../hooks/user/useFetchUsers";
import { IUser } from "../../../types/IUser";

const UserList: React.FC = () => {
  const { data: users, isLoading, error } = useFetchUsers();

  if (isLoading) return <Spin />;
  if (error) return <div>Error: {error.message}</div>;

  const columns: ColumnsType<IUser> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
  ];

  return <Table dataSource={users} columns={columns} rowKey="id" />;
};

export default UserList;
