import React from "react";
import { Form, Input, Select, FormInstance } from "antd";
import useFetchServiceCategories from "../../../hooks/serviceCategories/useFetchServiveCategories.ts";
import { IServiceCategories } from "../../../types/IServiceCategories.ts";
import useFetchStores from "../../../hooks/store/useFetchStores.ts";
import { IStore } from "../../../types/IStore.ts";

interface ServiceOverallProps {
  form: FormInstance;
}

const ServiceOverall: React.FC<ServiceOverallProps> = ({ form }) => {
  const { data: serviceCategories, isLoading } = useFetchServiceCategories();
  const { data: stores } = useFetchStores();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        id: null,
        name: "",
        description: "",
        storeId: "",
        estimatedTime: "",
        serviceCategoryId: "",
        status: false,
        petServiceDetails: [],
        petServiceSteps: [],
      }}
    >
      <Form.Item
        label="Service Name"
        name="name"
        rules={[
          { required: true, message: "Please enter the service name" },
          {
            pattern: /^[a-zA-Z0-9À-ỹ\s]+$/,
            message: "Tên sản phẩm không được chứa ký tự đặc biệt",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[
          { required: true, message: "Please enter the service description" },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        label="Store"
        name="storeId"
        rules={[{ required: true, message: "Please enter the store" }]}
      >
        <Select loading={isLoading} placeholder="Select a store">
          {stores?.items.map((store: IStore) => (
            <Select.Option key={store.id} value={store.id}>
              {store.name} - {store.businessAddressDistrict}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Estimated Time"
        name="estimatedTime"
        rules={[
          { required: true, message: "Please enter the estimated time" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value) {
                return Promise.reject("Please enter the estimated time");
              }
              const regex = /^\d+\s*-\s*\d+\s*(minutes|hours)$/i;
              if (!regex.test(value)) {
                return Promise.reject(
                  "Format must be '10 - 20 minutes' or '1 - 2 hours'"
                );
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input placeholder="e.g. 10 - 20 minutes or 1 - 2 hours" />
      </Form.Item>

      <Form.Item
        label="Service Category"
        name="serviceCategoryId"
        rules={[
          {
            required: true,
            message: "Please select the service category ID",
          },
        ]}
      >
        <Select loading={isLoading} placeholder="Select a category">
          {serviceCategories?.map((category: IServiceCategories) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Service Status"
        name="status"
        rules={[{ required: true, message: "Please select the status" }]}
      >
        <Select>
          <Select.Option value={true}>Active</Select.Option>
          <Select.Option value={false}>Inactive</Select.Option>
        </Select>
      </Form.Item>

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
