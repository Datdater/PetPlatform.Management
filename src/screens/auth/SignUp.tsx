import { Button, Form, Space, Spin, Steps, theme, Typography, message, Grid } from "antd";
import { useState } from "react";
import StoreInfoFormItem from "../../components/features/stores/StoreInfoFormItem";
import StoreFaxFormItem from "../../components/features/stores/StoreFaxFormItem";
import StoreIdentityFormItem from "../../components/features/stores/StoreIdentityFormItem";
import StoreAccountFormItem from '../../components/features/stores/StoreAccountFormItem';
import StoreFinalCheck from "../../components/features/stores/StoreFinalCheck";
import { useNavigate } from "react-router";
import { useAddStore } from "../../hooks/store/useAddStore";
import { useAuthStore } from "../../stores/authStore";

const SignUp = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const { mutate, isPending } = useAddStore();
  const { login } = useAuthStore();
  const [formValues, setFormValues] = useState({});
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const steps = [
    { title: "Thông tin cửa hàng", content: <StoreInfoFormItem form={form} /> },
    { title: "Thông tin thuế", content: <StoreFaxFormItem form={form} /> },
    { title: "Thông tin định danh", content: <StoreIdentityFormItem form={form} /> },
    { title: "Thông tin đăng nhập", content: <StoreAccountFormItem /> },
    { title: "Hoàn tất", content: <StoreFinalCheck /> },
  ];
  const isVertical = !screens.md || steps.length > 4;

  const next = () => setCurrent((c) => c + 1);
  const prev = () => setCurrent((c) => c - 1);

  const handleNext = () => {
    form.validateFields().then(() => {
      setFormValues((old) => ({ ...old, ...form.getFieldsValue() }));
      next();
    });
  };

  const handleFinish = async (values: any) => {
    const data = { ...values, ...formValues };
    
    // Thay thế mã code bằng tên địa chỉ
    if (data.businessAddressProvinceName) {
      data.businessAddressProvince = data.businessAddressProvinceName;
    }
    if (data.businessAddressDistrictName) {
      data.businessAddressDistrict = data.businessAddressDistrictName;
    }
    if (data.businessAddressWardName) {
      data.businessAddressWard = data.businessAddressWardName;
    }
    
    // Xóa các trường ẩn không cần thiết
    delete data.businessAddressProvinceName;
    delete data.businessAddressDistrictName;
    delete data.businessAddressWardName;
    
    mutate(
      data,
      {
        onSuccess: async () => {
          const loginResult = await login(values.username, values.password);
          if (loginResult.success) {
            navigate("/", { replace: true });
          } else {
            message.error(loginResult.error || "Đăng nhập tự động thất bại. Vui lòng đăng nhập thủ công.");
            navigate("/", { replace: true });
          }
        },
        onError: () => message.error("Tạo cửa hàng thất bại!"),
      }
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f4' }}>
      <div style={{ width: '100%', maxWidth: 1200, background: '#fff', borderRadius: 10, padding: 16, boxShadow: '0 0 10px #eee' }}>
        <Space style={{ width: '100%' }} direction="vertical">
          <Typography style={{ fontSize: 24, fontWeight: 600, marginTop: 8, textAlign: 'center' }}>Tạo cửa hàng mới</Typography>
          <Steps
            current={current}
            items={steps.map((s) => ({ key: s.title, title: s.title }))}
            direction="horizontal"
            style={{ marginBottom: 12, maxWidth: '100%', margin: '0 auto', fontSize: 14 }}
            responsive
          />
          <Spin spinning={isPending}>
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 15 }}
              onFinish={handleFinish}
            >
              <div style={{ margin: '12px 0', borderRadius: 8, border: '1px dashed #eee', padding: 12, background: '#fafbfc' }}>
                {steps[current].content}
              </div>
            </Form>
          </Spin>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            {current > 0 && current < steps.length - 1 && (
              <Button style={{ marginRight: 8 }} onClick={prev}>Quay lại</Button>
            )}
            {current < steps.length - 2 && (
              <Button type="primary" onClick={handleNext}>Tiếp tục</Button>
            )}
            {current === steps.length - 2 && (
              <Button type="primary" loading={isPending} onClick={() => form.submit()}>Hoàn tất</Button>
            )}
            {current === steps.length - 1 && (
              <Button type="primary" onClick={() => navigate("/", { replace: true })}>Về trang chủ</Button>
            )}
          </div>
        </Space>
      </div>
    </div>
  );
};

export default SignUp;
