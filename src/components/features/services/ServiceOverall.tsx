import React from "react";
import { Form, Input, Select, FormInstance, Card, Upload } from "antd";
import useFetchServiceCategories from "../../../hooks/serviceCategories/useFetchServiveCategories.ts";
import { IServiceCategories } from "../../../types/IServiceCategories.ts";
import useFetchStores from "../../../hooks/store/useFetchStores.ts";
import { IStore } from "../../../types/IStore.ts";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { UploadListType } from "antd/es/upload/interface";

interface ServiceOverallProps {
  form: FormInstance;
}

const ServiceOverall: React.FC<ServiceOverallProps> = ({ form }) => {
  const { data: serviceCategories, isLoading } = useFetchServiceCategories();
  const [fileList, setFileList] = useState<any[]>([]);

  // Upload props giống ProductForm
  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    action: `${import.meta.env.VITE_BACKEND_URL}/image`,
    listType: 'picture-card' as UploadListType,
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
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        id: null,
        name: "",
        description: "",
        estimatedTime: "",
        serviceCategoryId: "",
        status: false,
        image: "",
        petServiceDetails: [],
        petServiceSteps: [],
      }}
    >
      <Form.Item
        label="Tên dịch vụ"
        name="name"
        rules={[
          { required: true, message: "Vui lòng nhập tên dịch vụ" },
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
          { required: true, message: "Vui lòng nhập mô tả dịch vụ" },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label="Thời gian ước tính"
        name="estimatedTime"
        rules={[
          { required: true, message: "Vui lòng nhập thời gian ước tính" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value) {
                return Promise.reject("Vui lòng nhập thời gian ước tính");
              }
              // Chỉ cho phép đúng định dạng: x - y phút, x - y giờ, x - y ngày, với đúng 1 khoảng trắng hai bên dấu '-'
              const regex = /^\d+\s-\s\d+\s(phút|giờ|ngày)$/i;
              if (!regex.test(value)) {
                return Promise.reject(
                  "Định dạng phải là '10 - 20 phút', '1 - 2 giờ' hoặc '1 - 2 ngày'"
                );
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input placeholder="VD: 10 - 20 phút hoặc 1 - 2 giờ hoặc 1 - 2 ngày" />
      </Form.Item>

      <Form.Item
        label="Danh mục dịch vụ"
        name="serviceCategoryId"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn danh mục dịch vụ",
          },
        ]}
      >
        <Select loading={isLoading} placeholder="Chọn danh mục">
          {serviceCategories?.map((category: IServiceCategories) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Trạng thái dịch vụ"
        name="status"
        rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
      >
        <Select>
          <Select.Option value={true}>Hoạt động</Select.Option>
          <Select.Option value={false}>Không hoạt động</Select.Option>
        </Select>
      </Form.Item>

      <Card
        className="shadow-md hover:shadow-lg transition-shadow"
        title={<span style={{ fontWeight: 600 }}>Hình ảnh dịch vụ</span>}
        style={{ marginBottom: 24 }}
      >
        <Upload {...uploadProps}>
          {fileList.length >= 1 ? null : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <PlusOutlined style={{ fontSize: 24 }} />
              <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>Tải Ảnh</div>
            </div>
          )}
        </Upload>
        {/* Ẩn trường image để validate url */}
        <Form.Item name="image" rules={[{ required: true, message: "Vui lòng tải lên hình ảnh dịch vụ" }]} hidden>
          <Input />
        </Form.Item>
      </Card>

      {/* Hidden fields to maintain the form structure */}
      <Form.Item name="petServiceDetails" hidden>
        <Input />
      </Form.Item>

      <Form.Item name="petServiceSteps" hidden>
        <Input />
      </Form.Item>
    </Form>
  );
};

export default ServiceOverall;
