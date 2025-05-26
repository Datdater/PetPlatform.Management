import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import {
  IServiceDetailResponse,
  PetServiceDetail,
  PetServiceStep,
} from "../../../types/IServices"; // Adjust the import path

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

  useEffect(() => {
    if (isServiceDetailModalVisible && localServiceDetail) {
      form.setFieldsValue(localServiceDetail);
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

  return (
    <>
      <Modal
        title="Update Service Detail"
        visible={isServiceDetailModalVisible}
        onCancel={() => setIsServiceDetailModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSaveServiceDetail} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the name!" },
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
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Estimated Time"
            name="estimatedTime"
            rules={[
              { required: true, message: "Please input the estimated time!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select the status!" }]}
          >
            <Select>
              <Select.Option value={true}>Active</Select.Option>
              <Select.Option value={false}>Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Update Pet Service Modal */}
      <Modal
        title="Update Pet Service"
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
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="amount"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Pet Type"
            name="petType"
            rules={[{ required: true, message: "Please select pet type!" }]}
          >
            <Select>
              <Select.Option value={true}>Dog</Select.Option>
              <Select.Option value={false}>Cat</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Pet Weight Min"
            name="petWeightMin"
            rules={[
              {
                required: true,
                message: "Please input the minimum pet weight!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Pet Weight Max"
            name="petWeightMax"
            rules={[
              {
                required: true,
                message: "Please input the maximum pet weight!",
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
                      "Maximum pet weight must be greater than minimum pet weight"
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
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Pet Service Modal */}
      <Modal
        title="Add New Pet Service"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form form={addForm} onFinish={handleSaveAdd} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price"
            name="amount"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Pet Type"
            name="petType"
            rules={[{ required: true, message: "Please select pet type!" }]}
          >
            <Select>
              <Select.Option value={true}>Dog</Select.Option>
              <Select.Option value={false}>Cat</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Pet Weight Min"
            name="petWeightMin"
            rules={[
              {
                required: true,
                message: "Please input the minimum pet weight!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Pet Weight Max"
            name="petWeightMax"
            rules={[
              {
                required: true,
                message: "Please input the maximum pet weight!",
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
                      "Maximum pet weight must be greater than minimum pet weight"
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
              Add Service
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Pet Service Step Modal */}
      <Modal
        title="Add New Pet Service Step"
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
            label="Step Name"
            name="name"
            rules={[{ required: true, message: "Please input the step name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input the description!" },
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
              Add Step
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Pet Service Step Modal */}
      <Modal
        title="Update Pet Service Step"
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
            label="Step Name"
            name="name"
            rules={[{ required: true, message: "Please input the step name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input the description!" },
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
              Update Step
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default PetServiceModals;
