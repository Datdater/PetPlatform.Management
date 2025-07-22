import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Input, InputNumber, Select, Table, Space, Modal, Typography } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { PetServiceDetail } from "../../../types/IServices";

const ServiceDetailList: React.FC<{ serviceData?: any, onUpdateDetails?: (details: PetServiceDetail[]) => void }> = ({
                                                                                                                       serviceData,
                                                                                                                       onUpdateDetails
                                                                                                                     }) => {
  const [details, setDetails] = useState<PetServiceDetail[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDetail, setEditingDetail] = useState<PetServiceDetail | null>(null);
  const [form] = Form.useForm();
  const [idCounter, setIdCounter] = useState(1);

  const initialLoadDone = useRef(false);

  // First try to load from serviceData prop
  useEffect(() => {
    if (serviceData?.petServiceDetails?.length > 0 && !initialLoadDone.current) {
      setDetails(serviceData.petServiceDetails);
      const maxId = Math.max(...serviceData.petServiceDetails.map((detail: PetServiceDetail) => detail.id || 0), 0);
      setIdCounter(maxId + 1);
      initialLoadDone.current = true;
    } else if (!initialLoadDone.current) {
      const savedDetails = localStorage.getItem('serviceDetails');
      if (savedDetails) {
        try {
          const parsedDetails = JSON.parse(savedDetails);
          if (Array.isArray(parsedDetails) && parsedDetails.length > 0) {
            setDetails(parsedDetails);
              const maxId = Math.max(
                  ...parsedDetails.map((detail: PetServiceDetail) =>
                      detail.id ? parseInt(detail.id, 10) : 0
                  ),
                  0
              );
            setIdCounter(maxId + 1);
            initialLoadDone.current = true;
          }
        } catch (error) {
          console.error('Error parsing saved details:', error);
        }
      }
      initialLoadDone.current = true; // Mark as initialized even if empty
    }
  }, [serviceData]);

  // Sync changes back to parent and localStorage
  useEffect(() => {
    if (initialLoadDone.current && onUpdateDetails) {
      localStorage.setItem('serviceDetails', JSON.stringify(details));
      onUpdateDetails(details);
    }
  }, [details, onUpdateDetails]);

  const showModal = () => {
    form.resetFields();
    setEditingDetail(null);
    setIsModalVisible(true);
  };

  const showEditModal = (record: PetServiceDetail) => {
    setEditingDetail(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields()
        .then(values => {
          const newDetail: PetServiceDetail = {
            ...values,
            id: editingDetail ? editingDetail.id : idCounter.toString(),
          };

          const updatedDetails = editingDetail
              ? details.map(detail => detail.id === editingDetail.id ? newDetail : detail)
              : [...details, newDetail];

          setDetails(updatedDetails);

          if (!editingDetail) {
            setIdCounter(prev => prev + 1);
          }

          // Directly update localStorage and notify parent
          localStorage.setItem('serviceDetails', JSON.stringify(updatedDetails));
          if (onUpdateDetails) {
            onUpdateDetails(updatedDetails);
          }

          setIsModalVisible(false);
          form.resetFields();
        })
        .catch(info => {
          console.log('Validate Failed:', info);
        });
  };

  const handleDelete = (record: PetServiceDetail) => {
    const updatedDetails = details.filter(detail => detail.id !== record.id);
    setDetails(updatedDetails);

    // Directly update localStorage and notify parent
    localStorage.setItem('serviceDetails', JSON.stringify(updatedDetails));
    if (onUpdateDetails) {
      onUpdateDetails(updatedDetails);
    }
  };

  const columns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại thú cưng',
      dataIndex: 'petType',
      key: 'petType',
      render: (petType: boolean) => petType ? 'Chó' : 'Mèo',
    },
    {
      title: 'Khoảng cân nặng',
      key: 'weightRange',
      render: (_: any, record: PetServiceDetail) => (
          <span>{record.petWeightMin} - {record.petWeightMax} kg</span>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `${amount?.toLocaleString('vi-VN') || '0'}đ`,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: PetServiceDetail) => (
          <Space size="middle">
            <Button
                icon={<EditOutlined />}
                onClick={() => showEditModal(record)}
                type="text"
                title="Sửa"
            />
            <Button
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
                type="text"
                danger
                title="Xóa"
            />
          </Space>
      ),
    },
  ];

  return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Typography.Title level={4}>Chi tiết dịch vụ</Typography.Title>
          <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
          >
            Thêm chi tiết
          </Button>
        </div>

        <Table
            columns={columns}
            dataSource={details}
            rowKey={record => (record.id ?? '').toString()}
            pagination={false}
        />

        <Modal
            title={editingDetail ? "Sửa chi tiết dịch vụ" : "Thêm chi tiết dịch vụ"}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={editingDetail ? "Lưu thay đổi" : "Thêm mới"}
            cancelText="Hủy"
        >
          <Form
              form={form}
              layout="vertical"
              initialValues={{
                petWeightMin: 0,
                petWeightMax: 10,
                amount: 0,
                petType: true,
                description: "",
                name: ""
              }}
          >
            <Form.Item
                name="name"
                label="Tên dịch vụ"
                rules={[{ required: true, message: 'Please enter a name' }]}>
              <Input />
            </Form.Item>

            <Form.Item
                name="petType"
                label="Loại thú cưng"
                rules={[{ required: true, message: 'Please select a pet type' }]}>
              <Select>
                <Select.Option value={true}>Chó</Select.Option>
                <Select.Option value={false}>Mèo</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Khoảng cân nặng (kg)">
              <Input.Group compact>
                <Form.Item
                    name="petWeightMin"
                    noStyle
                    rules={[{ required: true, message: 'Required' }]}>
                  <InputNumber min={0} style={{ width: '45%' }} placeholder="Min" />
                </Form.Item>
                <span style={{ display: 'inline-block', width: '10%', textAlign: 'center' }}>-</span>
                <Form.Item
                    name="petWeightMax"
                    noStyle
                    rules={[{ required: true, message: 'Required' }]}>
                  <InputNumber min={0} style={{ width: '45%' }} placeholder="Max" />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item
                name="amount"
                label="Giá"
                rules={[{ required: true, message: 'Please enter an amount' }]}>
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
                name="description"
                label="Mô tả">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
};

export default ServiceDetailList;