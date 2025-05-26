import UserList from "../../components/features/user/UserList";
import React from "react";

const UsersScreen: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>User Management</h1>
      <h2>Hello User list</h2>
      <button onClick={() => alert("Button clicked!")}>Click Me</button>
      <UserList />
    </div>
  );
};

export default UsersScreen;
