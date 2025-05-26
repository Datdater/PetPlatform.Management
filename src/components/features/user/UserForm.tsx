import { Button, Card, Form, Input } from "antd";
import { IUser } from "../../../types/IUser";
import { Spin } from "antd";

type UserFormProps = {
  action: string;
  isPending: boolean;
  user: IUser | undefined;
  onSubmit: (values: IUser) => void;
};

const UserForm = ({ action, user, onSubmit, isPending }: UserFormProps) => {
  const [form] = Form.useForm();
  return (
    <Spin spinning={isPending}>
      <Form
        layout="vertical"
        autoComplete="off"
        onFinish={onSubmit}
        form={form}
        initialValues={user}
      >
        <Form.Item
          label="Username"
          name="username"
          validateTrigger="onBlur"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Input your username" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          validateTrigger="onBlur"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please input a valid email!" },
          ]}
        >
          <Input placeholder="Input your email" />
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          validateTrigger="onBlur"
          rules={[
            { required: true, message: "Please input your name!" },
            { min: 3, message: "Name must be at least 3 characters!" },
          ]}
        >
          <Input placeholder="Input your name" />
        </Form.Item>
        <Card>
          <Button
            type="primary"
            htmlType="button"
            onClick={() => form.submit()}
          >
            {action}
          </Button>
        </Card>
      </Form>
    </Spin>
  );
};

export default UserForm;
