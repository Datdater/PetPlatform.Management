import { Button, Card, Form, Input, message, Typography } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { appInfo } from "../../constants/appInfos";

const { Title, Text } = Typography;

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const handleSignUp = async (values: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    setIsLoading(true);

    try {
      const result = await register(
        values.email,
        values.password,
        values.name,
        values.phone
      );

      if (result.success) {
        message.success("Sign-up successful! Redirecting to login...");
        navigate("/");
      } else {
        // Display the specific error message
        setBackendError(result.error || "Sign-up failed");
        message.error(result.error || "Sign-up failed");
      }
    } catch (error) {
      message.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
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
          width: "100%",
          maxWidth: 400,
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src={appInfo.logo}
            alt="Logo"
            style={{ width: 48, height: 48, marginBottom: 8 }}
          />
          <Title level={3} style={{ fontWeight: 600, color: "#333" }}>
            Create an account
          </Title>
          <Text type="secondary">Start your 30-day free trial today.</Text>
        </div>

        {backendError && (
          <div
            style={{
              color: "red",
              backgroundColor: "#ffecec",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {backendError}
          </div>
        )}

        <Form
          layout="vertical"
          form={form}
          onFinish={handleSignUp}
          size="large"
        >
          <Form.Item
            name="name"
            label="Username"
            rules={[{ required: true, message: "Please enter your username!" }]}
          >
            <Input placeholder="Enter your full name" allowClear />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input
              placeholder="Enter your email"
              allowClear
              maxLength={100}
              type="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password placeholder="Create password" maxLength={100} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number!" },
            ]}
          >
            <Input placeholder="Enter your phone number" allowClear />
          </Form.Item>

          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
            style={{
              width: "100%",
              borderRadius: 6,
              fontWeight: 600,
              height: 45,
            }}
          >
            Sign up
          </Button>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Text type="secondary">Already have an account?</Text>
            <Link
              to="/"
              style={{ marginLeft: 6, color: "#1890ff", fontWeight: 500 }}
            >
              Log in
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
