import {
  Button,
  Form,
  FormInstance,
  Input,
  Radio,
  Upload,
  UploadProps,
} from "antd";
import { useState } from "react";

type StoreIdentityProps = {
  form: FormInstance;
};

const StoreIdentityFormItem = (appProps: StoreIdentityProps) => {
  const form = appProps.form;

  const uploadProps: UploadProps = {
    action: `${import.meta.env.VITE_BACKEND_URL}/image`,
    listType: "picture",
  };

  const [identityTypeName, setIdentityTypeName] = useState<string>(
    "Căn cước công dân (CCCD)"
  );

  function changeIdentity(value: string): void {
    if (value === "newIdentity") {
      setIdentityTypeName("Căn cước công dân (CCCD)");
    }
    if (value === "oldIdentity") {
      setIdentityTypeName("Chứng minh nhân dân (CMND)");
    }
    if (value === "passport") {
      setIdentityTypeName("Hộ chiếu");
    }
  }

  return (
    <div style={{ margin: "0 auto", width: "70%", padding: "40px 0px" }}>
      <Form.Item
        label="Hình thức định danh"
        name="identityType"
        initialValue={"newIdentity"}
      >
        <Radio.Group
          style={{ textAlign: "left" }}
          defaultValue="newIdentity"
          onChange={(e) => changeIdentity(e.target.value)}
        >
          <Radio value="newIdentity">Căn cước công dân (CCCD)</Radio>
          <Radio value="oldIdentity">Chứng minh nhân dân (CMND)</Radio>
          <Radio value="passport">Hộ chiếu</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label={`Số ${identityTypeName}`}
        name="identityNumber"
        validateTrigger="onBlur"
        rules={[
          {
            required: true,
            message: `Số ${identityTypeName} không được trống`,
          },
          {
            pattern: /^[0-9]{9,12}$/,
            message: `Số ${identityTypeName} không hợp lệ`,
          },
        ]}
        style={{ marginBottom: 20, textAlign: "left" }}
      >
        <Input placeholder={`Nhập số ${identityTypeName}`} />
      </Form.Item>

      <Form.Item
        label="Hình chụp mặt trước của thẻ CMND/CCCD/Hộ chiếu"
        name="frontIdentityCardUrl"
        style={{ marginBottom: 20, textAlign: "left" }}
      >
        <Upload
          {...uploadProps}
          onChange={(info) => {
            const { status, response } = info.file;

            const event = info.event;
            if (status === "done" && response) {
              form.setFieldsValue({
                ...form.getFieldsValue(), // Retain existing values
                frontIdentityCardUrl: response, // Update only logoUrl
              });
            }
          }}
        >
          <Button>Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Hình chụp mặt sau của thẻ CMND/CCCD/Hộ chiếu"
        name="backIdentityCardUrl"
        style={{ marginBottom: 20, textAlign: "left" }}
      >
        <Upload
          {...uploadProps}
          onChange={(info) => {
            const { status, response } = info.file;

            const event = info.event;
            if (status === "done" && response) {
              form.setFieldsValue({
                ...form.getFieldsValue(), // Retain existing values
                backIdentityCardUrl: response, // Update only logoUrl
              });
            }
          }}
        >
          <Button>Upload</Button>
        </Upload>
      </Form.Item>
    </div>
  );
};

export default StoreIdentityFormItem;
