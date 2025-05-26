import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/authStore"; // Import Zustand store
import AuthRouter from "./AuthRouter";
import MainRouter from "./MainRouter";
import { Spin } from "antd";

const Routers = () => {
  const [isLoading, setIsLoading] = useState(true); // ✅ Bắt đầu với isLoading = true

  const { token, setAuth } = useAuthStore(); // ✅ Lấy auth state từ Zustand

  useEffect(() => {
    const getData = () => {
      console.log("GetDataFromLocalStorage");
      try {
        const storedData = localStorage.getItem("auth-storage"); // ✅ Lấy dữ liệu từ localStorage
        console.log("Stored data:", storedData);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (parsedData.token) {
            setAuth(null, parsedData.token); // ✅ Truyền đúng định dạng {user, token}
            console.log("Parsed auth data:", parsedData);
          }
        }
      } catch (error) {
        console.error("Error parsing auth data:", error);
      } finally {
        setIsLoading(false); // ✅ Kết thúc loading sau khi kiểm tra xong
      }
    };

    getData();
  }, [setAuth]);

  return isLoading ? <Spin /> : !token ? <AuthRouter /> : <MainRouter />;
};

export default Routers;
