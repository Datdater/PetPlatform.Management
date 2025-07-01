import { Form, Input } from "antd";

const StoreAccountFormItem = () => (
  <>
    <Form.Item
      label="Tên đăng nhập"
      name="username"
      rules={[
        { required: true, message: "Vui lòng nhập tên đăng nhập!" },
        {
          pattern: /^[a-zA-Z0-9\-\._@+]+$/,
          message: "Chỉ cho phép chữ, số, -, ., _, @, +",
        },
      ]}
    >
      <Input placeholder="Nhập tên đăng nhập" />
    </Form.Item>
    <Form.Item
      label="Mật khẩu"
      name="password"
      rules={[
        { required: true, message: "Vui lòng nhập mật khẩu!" },
        { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" },
        {
          pattern: /[a-z]/,
          message: "Mật khẩu phải có ít nhất 1 chữ thường!",
        },
        {
          pattern: /[A-Z]/,
          message: "Mật khẩu phải có ít nhất 1 chữ hoa!",
        },
        {
          pattern: /[0-9]/,
          message: "Mật khẩu phải có ít nhất 1 số!",
        },
        {
          pattern: /[^a-zA-Z0-9]/,
          message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt!",
        },
      ]}
      hasFeedback
    >
      <Input.Password placeholder="Nhập mật khẩu" />
    </Form.Item>
    <Form.Item
      label="Xác nhận mật khẩu"
      name="confirmPassword"
      dependencies={["password"]}
      hasFeedback
      rules={[
        { required: true, message: "Vui lòng xác nhận mật khẩu!" },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue("password") === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
          },
        }),
      ]}
    >
      <Input.Password placeholder="Nhập lại mật khẩu" />
    </Form.Item>
  </>
);

export default StoreAccountFormItem; 