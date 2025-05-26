import { BrowserRouter, Route, Routes } from "react-router";
import Login from "../screens/auth/Login";
import SignUp from "../screens/auth/SignUp";

const AuthRouter = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col content-center">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </div>
  );
};

export default AuthRouter;
