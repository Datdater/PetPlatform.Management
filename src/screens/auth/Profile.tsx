import { Button, Card, Typography, Modal, Image, Descriptions, Spin, Row, Col, Alert, Form, Input, message } from "antd";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useQuery } from '@tanstack/react-query';
import { getStore } from "../../services/store.service";
import { IStore } from "../../types/IStore";

const { Title } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateForm] = Form.useForm();
  const { user, changePassword } = useAuthStore();

  // Fetch store data using react-query
  const { data: store, isLoading, error, refetch } = useQuery<IStore>({
    queryKey: ['store', user?.storeId],
    queryFn: () => getStore(user?.storeId || ''),
    enabled: !!user?.storeId,
  });

  // Handle store update
  const handleUpdateStore = async (values: any) => {
    setIsUpdating(true);
    try {
      // TODO: Implement update store API call
      // const response = await updateStore(store?.id || '', values);
      console.log('Updating store with values:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success('Cập nhật thông tin cửa hàng thành công!');
      setIsUpdateModalVisible(false);
      refetch(); // Refresh store data
    } catch (error) {
      message.error('Cập nhật thất bại. Vui lòng thử lại!');
    } finally {
      setIsUpdating(false);
    }
  };

  // Update store modal
  const renderUpdateModal = () => (
    <Modal
      title="Cập nhật thông tin cửa hàng"
      open={isUpdateModalVisible}
      onCancel={() => setIsUpdateModalVisible(false)}
      footer={null}
      width={800}
    >
      <Form
        form={updateForm}
        layout="vertical"
        onFinish={handleUpdateStore}
        initialValues={store}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên cửa hàng"
              rules={[{ required: true, message: 'Vui lòng nhập tên cửa hàng!' }]}
            >
              <Input placeholder="Nhập tên cửa hàng" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="hotline"
              label="Hotline"
              rules={[{ required: true, message: 'Vui lòng nhập số hotline!' }]}
            >
              <Input placeholder="Nhập số hotline" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="faxEmail"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' }
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="faxCode"
              label="Mã số thuế/ĐKKD"
              rules={[{ required: true, message: 'Vui lòng nhập mã số thuế!' }]}
            >
              <Input placeholder="Nhập mã số thuế" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="businessAddressProvince"
              label="Tỉnh/Thành phố"
              rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
            >
              <Input placeholder="Tỉnh/Thành phố" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="businessAddressDistrict"
              label="Quận/Huyện"
              rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}
            >
              <Input placeholder="Quận/Huyện" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="businessAddressWard"
              label="Phường/Xã"
              rules={[{ required: true, message: 'Vui lòng chọn phường/xã!' }]}
            >
              <Input placeholder="Phường/Xã" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="businessAddressStreet"
              label="Địa chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isUpdating}
            style={{ width: '100%' }}
          >
            Cập nhật thông tin
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !store) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Card style={{ width: 400, padding: 24 }}>
          <Title level={3} style={{ textAlign: "center", color: "red" }}>
            Không thể tải thông tin cửa hàng
          </Title>
          <p style={{ textAlign: "center" }}>
            Vui lòng thử lại sau.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f4", padding: 32 }}>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={14} xl={12}>
          <Card style={{ padding: 0, borderRadius: 12, overflow: 'hidden' }}>
            {/* Banner */}
            {store.bannerUrl && (
              <div style={{ width: '100%', height: 180, overflow: 'hidden', background: '#eee' }}>
                <Image src={store.bannerUrl} alt="Banner" style={{ width: '100%', height: 180, objectFit: 'cover' }} preview={false} />
              </div>
            )}
            <div style={{ padding: 24 }}>
              {/* Logo + Name */}
              <Row gutter={24} align="middle" style={{ marginBottom: 24 }}>
                <Col xs={24} sm={6} style={{ textAlign: 'center' }}>
                  <Image
                    src={store.logoUrl}
                    alt="Logo"
                    width={100}
                    height={100}
                    style={{ borderRadius: '50%', border: '2px solid #eee', objectFit: 'cover', background: '#fff' }}
                    fallback="https://via.placeholder.com/100x100?text=No+Logo"
                    preview={false}
                  />
                </Col>
                <Col xs={24} sm={18}>
                  <Title level={3} style={{ margin: 0 }}>{store.name}</Title>
                  <div style={{ color: '#888', fontSize: 16, marginBottom: 8 }}>{store.businessType === 'personal' ? 'Cá nhân' : 'Doanh nghiệp'}</div>
                  <div style={{ color: '#555' }}><b>Hotline:</b> {store.hotline}</div>
                  <div style={{ color: '#555' }}><b>Email:</b> {store.faxEmail}</div>
                </Col>
              </Row>
              {/* Details */}
              <Descriptions column={1} bordered size="middle" style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Tên cửa hàng">{store.name}</Descriptions.Item>
                <Descriptions.Item label="Mã số thuế/ĐKKD">{store.faxCode}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ">
                  {store.businessAddressStreet}, {store.businessAddressWard}, {store.businessAddressDistrict}, {store.businessAddressProvince}
                </Descriptions.Item>
              </Descriptions>
              {/* Identity Images */}
              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: 8, fontWeight: 500 }}>Mặt trước CMND/CCCD</div>
                  <Image
                    src={store.frontIdentityCardUrl}
                    alt="Front ID"
                    style={{ width: '100%', maxHeight: 180, objectFit: 'cover', border: '1px solid #eee' }}
                    fallback="https://via.placeholder.com/300x180?text=No+Image"
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: 8, fontWeight: 500 }}>Mặt sau CMND/CCCD</div>
                  <Image
                    src={store.backIdentityCardUrl}
                    alt="Back ID"
                    style={{ width: '100%', maxHeight: 180, objectFit: 'cover', border: '1px solid #eee' }}
                    fallback="https://via.placeholder.com/300x180?text=No+Image"
                  />
                </Col>
              </Row>
              {/* Action Buttons */}
              <Row gutter={16} style={{ textAlign: 'center' }}>
                <Col span={24}>
                  <Button 
                    type="primary" 
                    size="large" 
                    onClick={() => setIsUpdateModalVisible(true)}
                    style={{ width: '100%' }}
                  >
                    Cập nhật thông tin
                  </Button>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
      {renderUpdateModal()}
    </div>
  );
};

export default Profile;
