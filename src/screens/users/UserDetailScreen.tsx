import { useParams } from "react-router";
import { useFetchUser } from "../../hooks/user/useFetchUser";
import { Spin } from "antd";

const UserDetailScreen = () => {
  const { id } = useParams();
  const { data: userDetail, isLoading } = useFetchUser(id ? parseInt(id) : 0);
  if (isLoading) return <Spin />;
  return (
    <>
      <h1>User Detail</h1>
      <p>{userDetail?.name}</p>
      <p>{userDetail?.email}</p>
    </>
  );
};

export default UserDetailScreen;
