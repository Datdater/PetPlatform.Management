import {
  Button,
  Form,
  FormInstance,
  Input,
  Select,
  Upload,
  UploadProps,
  Image,
} from "antd";
import { useEffect, useState } from "react";
import { getStoreAddress } from "../../../services/store.service";

type StoreInforFormItemProps = {
  form: FormInstance;
};

const StoreInfoFormItem = (propss: StoreInforFormItemProps) => {
  const form = propss.form;
  const props: UploadProps = {
    action: `${import.meta.env.VITE_BACKEND_URL}/image`,
    listType: "picture",
  };

  const [logoUrlLink, setLogoUrlLink] = useState("");
  const [bannerUrlLink, setBannerUrlLink] = useState("");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [addresses, setAddresses] = useState<
    { value: string; label: string }[]
  >([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await getStoreAddress();
      const addressOptions = data.map((address) => ({
        value: address.id,
        label: address.addressFullPath,
      }));
      setAddresses(addressOptions);
    };
    fetchData();
  }, []);

  return (
    <div style={{ margin: "0 auto", width: "70%", padding: "40px 0px" }}>
      <Form.Item
        label="Tên cửa hàng"
        name="name"
        validateTrigger="onBlur"
        rules={[
          { required: true, message: "Tên cửa hàng không được trống" },
          { max: 20, message: "Tên cửa hàng không được quá 20 ký tự" },
          {
            pattern: /^[a-zA-Z0-9À-ỹ\s]+$/,
            message: "Tên sản phẩm không được chứa ký tự đặc biệt",
          },
        ]}
        style={{ marginBottom: 20, textAlign: "left" }}
      >
        <Input showCount maxLength={20} placeholder="Nhập tên cửa hàng" />
      </Form.Item>

      <Form.Item
        label="Địa chỉ lấy hàng"
        name="addressId"
        validateTrigger="onBlur"
        rules={[
          { required: true, message: "Địa chỉ lấy hàng không được trống" },
        ]}
        style={{ marginBottom: 20, textAlign: "left" }}
      >
        <Select
          showSearch
          placeholder="Chọn địa chỉ lấy hàng"
          options={addresses}
        />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="hotline"
        validateTrigger="onBlur"
        rules={[
          { required: true, message: "Số điện thoại không được trống" },
          { max: 10, message: "Số điện thoại không được quá 10 ký tự" },
          {
            pattern: /^[0-9]+$/,
            message: "Số điện thoại không đúng định dạng",
          },
        ]}
        style={{ marginBottom: 10, textAlign: "left" }}
      >
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>

      <Form.Item
        label="Store Logo"
        name="logoUrl"
        style={{ marginBottom: 20, textAlign: "left" }}
      >
        <Upload
          {...props}
          onChange={(info) => {
            const { status, response } = info.file;

            const event = info.event;
            if (status === "done" && response) {
              setLogoUrlLink(response);
              form.setFieldsValue({
                ...form.getFieldsValue(), // Retain existing values
                logoUrl: response, // Update only logoUrl
              });
            }
          }}
          onPreview={(file) => {
            return file.response;
          }}
        >
          <Button>Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item
        label="Store Banner"
        name="bannerUrl"
        style={{ marginBottom: 0, textAlign: "left" }}
      >
        {!form.getFieldValue("bannerUrl") && (
          <Upload
            {...props}
            onChange={(info) => {
              const { status, response } = info.file;

              const event = info.event;
              if (status === "done" && response) {
                setBannerUrlLink(response);
                form.setFieldsValue({
                  ...form.getFieldsValue(), // Retain existing values
                  bannerUrl: response, // Update only logoUrl
                });
              }
            }}
          >
            <Button>Upload</Button>
          </Upload>
        )}
        {form.getFieldValue("bannerUrl") && (
          <Image
            width={300}
            height={300}
            src={form.getFieldValue("bannerUrl")}
          />
        )}
      </Form.Item>
    </div>
  );
};

export default StoreInfoFormItem;
