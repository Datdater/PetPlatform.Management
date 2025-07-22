import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, Upload } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import {
  IServiceDetailResponse,
  PetServiceDetail,
  PetServiceStep,
} from "../../../types/IServices"; // Adjust the import path
import { uploadImage } from '../../../services/image.service';
import { message } from "antd";

interface PetServiceModalsProps {
  isUpdateModalVisible: boolean;
  isAddModalVisible: boolean;
  isStepModalVisible: boolean;
  isStepUpdateModalVisible: boolean;
  isServiceDetailModalVisible: boolean; // New prop for service detail modal
  selectedService: PetServiceDetail | null;
  newStep: PetServiceStep | null;
  localServiceDetail: IServiceDetailResponse | null; // New prop for service detail
  setIsUpdateModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAddModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsStepModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsStepUpdateModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsServiceDetailModalVisible: React.Dispatch<React.SetStateAction<boolean>>; // New setter for service detail modal
  handleSaveUpdate: (values: PetServiceDetail) => void;
  handleSaveAdd: (values: PetServiceDetail) => void;
  handleSaveStep: (step: PetServiceStep) => void;
  handleUpdateStep: (step: PetServiceStep) => void;
  handleSaveServiceDetail: (values: IServiceDetailResponse) => void;
}

const PetServiceModals: React.FC<PetServiceModalsProps> = ({
  isUpdateModalVisible,
  isAddModalVisible,
  isStepModalVisible,
  isStepUpdateModalVisible,
  isServiceDetailModalVisible, // New prop
  selectedService,
  newStep,
  localServiceDetail, // New prop
  setIsUpdateModalVisible,
  setIsAddModalVisible,
  setIsStepModalVisible,
  setIsStepUpdateModalVisible,
  setIsServiceDetailModalVisible, // New setter
  handleSaveUpdate,
  handleSaveAdd,
  handleSaveStep,
  handleUpdateStep,
  handleSaveServiceDetail, // New handler
}) => {
  const [updateForm] = Form.useForm();
  const [addForm] = Form.useForm();
  const [stepForm] = Form.useForm();
  const [stepUpdateForm] = Form.useForm();
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

  useEffect(() => {
    if (isServiceDetailModalVisible && localServiceDetail) {
      // Parse estimatedTime sang tiếng Việt nếu là tiếng Anh
      let estimatedTimeVi = localServiceDetail.estimatedTime;
      if (estimatedTimeVi && estimatedTimeVi.includes('minutes')) {
        estimatedTimeVi = estimatedTimeVi.replace('minutes', 'phút').trim();
      }
      if (estimatedTimeVi && estimatedTimeVi.includes('hours')) {
        estimatedTimeVi = estimatedTimeVi.replace('hours', 'giờ').trim();
      }
      form.setFieldsValue({ ...localServiceDetail, estimatedTime: estimatedTimeVi });
      if (localServiceDetail.image) {
        setFileList([
          {
            uid: '-1',
            name: 'image',
            status: 'done',
            url: localServiceDetail.image,
          },
        ]);
      } else {
        setFileList([]);
      }
    }
  }, [isServiceDetailModalVisible, localServiceDetail, form]);

  // Reset forms when modal visibility changes
  useEffect(() => {
    if (isUpdateModalVisible && selectedService) {
      updateForm.setFieldsValue(selectedService);
    }
  }, [isUpdateModalVisible, selectedService, updateForm]);

  useEffect(() => {
    if (!isAddModalVisible) {
      addForm.resetFields();
    }
  }, [isAddModalVisible, addForm]);

  useEffect(() => {
    if (!isStepModalVisible) {
      stepForm.resetFields();
    }
  }, [isStepModalVisible, stepForm]);

  useEffect(() => {
    if (isStepUpdateModalVisible && newStep) {
      stepUpdateForm.setFieldsValue(newStep);
    }
  }, [isStepUpdateModalVisible, newStep, stepUpdateForm]);

  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    action: `${import.meta.env.VITE_BACKEND_URL}/image`,
    listType: 'picture-card' as const,
    onChange: (info: any) => {
      setFileList(info.fileList);
      if (info.file.status === 'done' && info.file.response) {
        form.setFieldsValue({ image: info.file.response.url || info.file.response });
      }
      if (info.file.status === 'removed' || !info.fileList || info.fileList.length === 0) {
        form.setFieldsValue({ image: '' });
      }
    },
    onRemove: () => {
      form.setFieldsValue({ image: '' });
    },
    maxCount: 1,
  };

  return (
    <>
      <Modal
        title="Cập nhật thông tin dịch vụ"
        visible={isServiceDetailModalVisible}
        onCancel={() => setIsServiceDetailModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={(values) => {
            // Convert estimatedTime sang tiếng Anh trước khi submit
            let estimatedTimeEn = values.estimatedTime;
            if (estimatedTimeEn.includes('phút')) {
              estimatedTimeEn = estimatedTimeEn.replace('phút', 'minutes').replace('~', '').trim();
            }
            if (estimatedTimeEn.includes('giờ')) {
              estimatedTimeEn = estimatedTimeEn.replace('giờ', 'hours').replace('~', '').trim();
            }
            values.estimatedTime = estimatedTimeEn;
            // Always get image from form value (like name)
            values.image = form.getFieldValue('image');
            handleSaveServiceDetail(values);
          }}
          layout="vertical"
        >
          <Form.Item
            label="Tên dịch vụ"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên dịch vụ!" },
              {
                pattern: /^[a-zA-Z0-9À-ỹ\s]+$/,
                message: "Tên dịch vụ không được chứa ký tự đặc biệt",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ảnh dịch vụ"
            name="image"
          >
            <Upload {...uploadProps}>
              {fileList.length >= 1 ? null : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <PlusOutlined style={{ fontSize: 24 }} />
                  <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>Tải Ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Thời gian dự kiến (hiển thị)"
            name="estimatedTime"
            rules={[
              { required: true, message: "Vui lòng nhập thời gian dự kiến!" },
            ]}
          >
            <Input placeholder="VD: 40 - 60 phút" />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Select.Option value={true}>Hoạt động</Select.Option>
              <Select.Option value={false}>Không hoạt động</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Update Pet Service Modal */}
      <Modal
        title="Cập nhật dịch vụ thú cưng"
        open={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={null}
      >
        <Form
          form={updateForm}
          onFinish={handleSaveUpdate}
          layout="vertical"
          initialValues={selectedService || {}}
        >
          <Form.Item name="id" initialValue={selectedService?.id} hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Tên dịch vụ"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="amount"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Loại thú cưng"
            name="petType"
            rules={[{ required: true, message: "Vui lòng chọn loại thú cưng!" }]}
          >
            <Select>
              <Select.Option value={true}>Chó</Select.Option>
              <Select.Option value={false}>Mèo</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Cân nặng tối thiểu"
            name="petWeightMin"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập cân nặng tối thiểu!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Cân nặng tối đa"
            name="petWeightMax"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập cân nặng tối đa!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const petWeightMin = getFieldValue("petWeightMin");
                  if (
                    !value ||
                    (petWeightMin !== undefined && petWeightMin < value)
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Cân nặng tối đa phải lớn hơn cân nặng tối thiểu"
                    )
                  );
                },
              }),
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Pet Service Modal */}
      <Modal
        title="Thêm dịch vụ thú cưng mới"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form form={addForm} onFinish={handleSaveAdd} layout="vertical">
          <Form.Item
            label="Tên dịch vụ"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên dịch vụ!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="amount"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Loại thú cưng"
            name="petType"
            rules={[{ required: true, message: "Vui lòng chọn loại thú cưng!" }]}
          >
            <Select>
              <Select.Option value={true}>Chó</Select.Option>
              <Select.Option value={false}>Mèo</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Cân nặng tối thiểu"
            name="petWeightMin"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập cân nặng tối thiểu!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Cân nặng tối đa"
            name="petWeightMax"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập cân nặng tối đa!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const petWeightMin = getFieldValue("petWeightMin");
                  if (
                    !value ||
                    (petWeightMin !== undefined && petWeightMin < value)
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Cân nặng tối đa phải lớn hơn cân nặng tối thiểu"
                    )
                  );
                },
              }),
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm dịch vụ
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Pet Service Step Modal */}
      <Modal
        title="Thêm bước dịch vụ mới"
        open={isStepModalVisible}
        onCancel={() => setIsStepModalVisible(false)}
        footer={null}
      >
        <Form
          form={stepForm}
          onFinish={(values) => {
            handleSaveStep({ ...values, priority: newStep?.priority });
          }}
          layout="vertical"
        >
          <Form.Item
            label="Tên bước"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên bước!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả!" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Hidden field for priority */}
          <Form.Item name="priority" initialValue={newStep?.priority} hidden>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm bước
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Pet Service Step Modal */}
      <Modal
        title="Cập nhật bước dịch vụ"
        open={isStepUpdateModalVisible}
        onCancel={() => setIsStepUpdateModalVisible(false)}
        footer={null}
      >
        <Form
          form={stepUpdateForm}
          onFinish={(values) => {
            // Make sure to preserve the ID when updating
            handleUpdateStep({
              ...values,
              id: newStep?.id,
              priority: newStep?.priority,
            });
          }}
          layout="vertical"
          initialValues={newStep || {}}
        >
          <Form.Item
            label="Tên bước"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên bước!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="priority" hidden>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật bước
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PetServiceModals;
