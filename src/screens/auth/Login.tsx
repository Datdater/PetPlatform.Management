import { Button, Card, Checkbox, Form, Input, Typography, message } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../../stores/authStore";
import { appInfo, localDataNames } from "../../constants/appInfos";

const { Title, Text } = Typography;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRemember, setIsRemember] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuthStore();

    const [backendError, setBackendError] = useState<string | null>(null);


  const handleLogin = async (values: {
    emailOrUserNameOrPhone: string;
    password: string;
  }) => {
    setIsLoading(true);
    const { success, error } = await login(
      values.emailOrUserNameOrPhone,
      values.password
    );
    const authStore = useAuthStore.getState();
    if (success) {
      if (isRemember) {
        localStorage.setItem(
          localDataNames.authData,
          JSON.stringify({
            state: {
              user: authStore.user,
              token: authStore.token,
              error: authStore.error,
            },
          })
        );
      }
      navigate("/");
    } else {
      message.error(error || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    }

    setIsLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        padding: 20,
      }}
    >
      <Card
        style={{
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: 12,
          padding: 24,
          width: "100%",
          maxWidth: 400,
          backgroundColor: "white",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src={appInfo.logo}
            alt="Logo"
            style={{ width: 80, height: 80}}
          />
          <Title level={3} style={{ fontWeight: 600, color: "#333" }}>
            Đăng nhập tài khoản
          </Title>
          <Text type="secondary">Chào mừng bạn quay lại! Vui lòng nhập thông tin.</Text>
        </div>

        <Form layout="vertical" form={form} onFinish={handleLogin} size="large">
          <Form.Item
            name="emailOrUserNameOrPhone"
            label="Email, Tên đăng nhập hoặc Số điện thoại"
            rules={[{ required: true, message: "Vui lòng nhập email, tên đăng nhập hoặc số điện thoại!" }]}
          >
            <Input
              placeholder="Nhập email, tên đăng nhập hoặc số điện thoại"
              allowClear
              maxLength={100}
              style={{
                borderRadius: 6,
                borderColor: "#d9d9d9",
                height: 40,
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              maxLength={100}
              style={{
                borderRadius: 6,
                borderColor: "#d9d9d9",
                height: 40,
              }}
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Checkbox
              checked={isRemember}
              onChange={(e) => setIsRemember(e.target.checked)}
            >
              Ghi nhớ 30 ngày
            </Checkbox>
            <Link
              to="/forgot-password"
              style={{ color: "#1890ff", fontWeight: 500 }}
            >
              Quên mật khẩu?
            </Link>
          </div>

          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
            style={{
              width: "100%",
              borderRadius: 6,
              fontWeight: 600,
              textTransform: "uppercase",
              height: 45,
            }}
          >
            Đăng nhập
          </Button>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Text type="secondary">Chưa có tài khoản?</Text>
            <Link
              to="/sign-up"
              style={{ color: "#1890ff", fontWeight: 500, marginLeft: 6 }}
            >
              Đăng ký
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
