import { Button, Card, Form, Input, message, Typography, Modal } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../stores/authStore";

const { Title } = Typography;

const Profile = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const navigate = useNavigate();
  const { user, updateProfile, changePassword } = useAuthStore();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false); // New state
  const [updateSuccess, setUpdateSuccess] = useState(false); // New state

  // Existing useEffect for setting initial form values
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user, form]);

  // Profile update handler
  const handleUpdate = async (values: {
    name: string;
    phoneNumber: string;
  }) => {
    const success = await updateProfile(
      user!.id,
      user!.email,
      values.name,
      values.phoneNumber
    );

    if (success) {
      setUpdateSuccess(true); // Set success state
      message.success("Profile updated successfully!");
      navigate("/profile");
    } else {
      setUpdateSuccess(false); // Reset success state
      message.error("Failed to update profile. Please try again.");
    }
  };

  // Password change handler
  const handlePasswordChange = async (values: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    // Reset previous backend error and success state
    setBackendError(null);
    setPasswordChangeSuccess(false);

    // Check if new passwords match
    if (values.newPassword !== values.confirmPassword) {
      message.error("New passwords do not match");
      return;
    }

    setIsPasswordLoading(true);
    const result = await changePassword(values.oldPassword, values.newPassword);
    setIsPasswordLoading(false);

    if (result.success) {
      setPasswordChangeSuccess(true); // Set success state
      message.success("Password changed successfully!");
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
    } else {
      // Set backend error for display
      setBackendError(result.error || "Failed to change password");
    }
  };

  // Password change modal
  const renderPasswordChangeModal = () => (
    <Modal
      title="Change Password"
      open={isPasswordModalVisible}
      onCancel={() => {
        setIsPasswordModalVisible(false);
        setBackendError(null); // Clear error when modal is closed
        setPasswordChangeSuccess(false); // Reset success state
      }}
      footer={null}
    >
      {/* Success message - only show when passwordChangeSuccess is true */}
      {passwordChangeSuccess && (
        <div
          style={{
            color: "#52c41a",
            backgroundColor: "#f6ffed",
            border: "1px solid #52c41a",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Password changed successfully!
        </div>
      )}

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
        form={passwordForm}
        layout="vertical"
        onFinish={handlePasswordChange}
      >
        <Form.Item
          name="oldPassword"
          label="Current Password"
          rules={[
            { required: true, message: "Please enter your current password" },
          ]}
        >
          <Input.Password placeholder="Enter current password" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: "Please enter a new password" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isPasswordLoading}
            style={{ width: "100%" }}
          >
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Card style={{ width: 400, padding: 24, backgroundColor: "white" }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Update Profile
        </Title>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleUpdate}
          size="large"
        >
          {updateSuccess && (
            <div
              style={{
                color: "#52c41a",
                backgroundColor: "#f6ffed",
                border: "1px solid #52c41a",
                padding: "10px",
                borderRadius: "4px",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              Updated profile successfully!
            </div>
          )}

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
          {/* Existing form fields remain the same */}
          <Form.Item name="email" label="Email">
            <Input placeholder="Email" disabled />
          </Form.Item>

          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: "Please enter your full name!" },
            ]}
          >
            <Input placeholder="Enter your full name" allowClear />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number!" },
            ]}
          >
            <Input placeholder="Enter your phone number" allowClear />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", marginBottom: 16 }}
          >
            Update Profile
          </Button>
        </Form>

        {/* Add button to open password change modal */}
        <Button
          type="default"
          style={{ width: "100%" }}
          onClick={() => setIsPasswordModalVisible(true)}
        >
          Change Password
        </Button>

        {/* Render password change modal */}
        {renderPasswordChangeModal()}
      </Card>
    </div>
  );
};

export default Profile;
