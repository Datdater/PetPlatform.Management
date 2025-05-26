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
    emailOrPhone: string;
    password: string;
  }) => {
    setIsLoading(true);
    const { success, error } = await login(
      values.emailOrPhone,
      values.password
    );
    const authStore = useAuthStore.getState();
    if (success) {
      message.success("Login successful!");
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
      message.error(error || "Login failed. Please check your credentials.");
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
            style={{ width: 48, height: 48, marginBottom: 8 }}
          />
          <Title level={3} style={{ fontWeight: 600, color: "#333" }}>
            Log in to your account
          </Title>
          <Text type="secondary">Welcome back! Please enter your details.</Text>
        </div>

        <Form layout="vertical" form={form} onFinish={handleLogin} size="large">
          <Form.Item
            name="emailOrPhone"
            label="Email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              placeholder="Enter your email"
              allowClear
              maxLength={100}
              type="email"
              style={{
                borderRadius: 6,
                borderColor: "#d9d9d9",
                height: 40,
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              placeholder="Enter your password"
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
              Remember for 30 days
            </Checkbox>
            <Link
              to="/forgot-password"
              style={{ color: "#1890ff", fontWeight: 500 }}
            >
              Forgot password?
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
            Log in
          </Button>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Text type="secondary">Don't have an account?</Text>
            <Link
              to="/sign-up"
              style={{ color: "#1890ff", fontWeight: 500, marginLeft: 6 }}
            >
              Sign up
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
