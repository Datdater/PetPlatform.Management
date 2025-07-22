import { Form, Input, Radio, Select } from "antd";
import type { FormInstance } from "antd/es/form";
import { useEffect, useState } from "react";
import {
  fetchProvince,
  fetchDistrict,
  fetchWard,
  IWard,
} from "../../../services/address.service";

interface ISelectOption {
  value: string;
  label: string;
}

interface StoreFaxFormItemProps {
  form?: FormInstance;
}

const StoreFaxFormItem = ({ form }: StoreFaxFormItemProps) => {
  const [provinces, setProvinces] = useState<ISelectOption[]>([]);
  const [districts, setDistricts] = useState<ISelectOption[]>([]);
  const [wards, setWards] = useState<ISelectOption[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [ward, setWard] = useState<IWard>();

  const [summaryAddress, setSummaryAddress] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProvince();
      setProvinces(
        data.map((province) => ({ value: province.code, label: province.name }))
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      const data = await fetchDistrict(selectedProvince);
      setDistricts(
        data.map((district) => ({ value: district.code, label: district.name }))
      );
    };
    if (selectedProvince) {
      fetchDistricts();
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchWard(selectedDistrict).then((data) => {
        setWards(data.map((ward) => ({ value: ward.code, label: ward.name })));
        const ward = data.find((ward) => ward.code === selectedWard);
        setWard(ward);
      });
    }
  }, [selectedDistrict, selectedWard]);

  // Hàm lấy tên địa chỉ từ mã code
  const getProvinceName = (code: string) => {
    return provinces.find(p => p.value === code)?.label || "";
  };

  const getDistrictName = (code: string) => {
    return districts.find(d => d.value === code)?.label || "";
  };

  const getWardName = (code: string) => {
    return wards.find(w => w.value === code)?.label || "";
  };

  return (
    <div style={{ margin: "0 auto", width: "70%", padding: "40px 0px" }}>
      <Form.Item
        label="Loại hình kinh doanh"
        name="businessType"
        initialValue={"personal"}
      >
        <Radio.Group style={{ textAlign: "left" }} defaultValue={"personal"}>
          <Radio value="personal">Cá nhân</Radio>
          <Radio value="business">Doanh nghiệp</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        label="Tỉnh/Thành phố"
        name="businessAddressProvince"
        validateTrigger="onBlur"
        rules={[{ required: true, message: "Tỉnh/Thành phố không được trống" }]}
        style={{ marginBottom: 20, textAlign: "left" }}
      >
        <Select
          showSearch
          placeholder="Chọn tỉnh/thành phố đăng ký kinh doanh"
          optionFilterProp="label"
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          onChange={(value) => {
            setSelectedProvince(value);
            // Cập nhật tên tỉnh/thành phố vào trường ẩn
            if (form) {
              const provinceName = getProvinceName(value);
              form.setFieldsValue({ businessAddressProvinceName: provinceName });
            }
          }}
          options={provinces}
        />
      </Form.Item>

      {/* Trường ẩn để lưu tên tỉnh/thành phố */}
      <Form.Item
        name="businessAddressProvinceName"
        hidden
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Quận/Huyện"
        name="businessAddressDistrict"
        validateTrigger="onBlur"
        rules={[{ required: true, message: "Quận/Huyện không được trống" }]}
        style={{ marginBottom: 20, textAlign: "left" }}
      >
        <Select
          onChange={(value) => {
            setSelectedDistrict(value);
            // Cập nhật tên quận/huyện vào trường ẩn
            if (form) {
              const districtName = getDistrictName(value);
              form.setFieldsValue({ businessAddressDistrictName: districtName });
            }
          }}
          showSearch
          placeholder="Chọn quận/huyện đăng ký kinh doanh"
          optionFilterProp="label"
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={districts}
        />
      </Form.Item>

      {/* Trường ẩn để lưu tên quận/huyện */}
      <Form.Item
        name="businessAddressDistrictName"
        hidden
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Phường/Xã"
        name="businessAddressWard"
        validateTrigger="onBlur"
        rules={[{ required: true, message: "Phường/Xã không được trống" }]}
        style={{ marginBottom: 20, textAlign: "left" }}
      >
        <Select
          onChange={(value) => {
            setSelectedWard(value);
            // Cập nhật tên phường/xã vào trường ẩn
            if (form) {
              const wardName = getWardName(value);
              form.setFieldsValue({ businessAddressWardName: wardName });
            }
          }}
          showSearch
          placeholder="Chọn phường/xã đăng ký kinh doanh"
          optionFilterProp="label"
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={wards}
        />
      </Form.Item>

      {/* Trường ẩn để lưu tên phường/xã */}
      <Form.Item
        name="businessAddressWardName"
        hidden
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Địa chỉ cụ thể"
        name="businessAddressStreet"
        validateTrigger="onBlur"
        rules={[{ required: true, message: "Địa chỉ cụ thể không được trống" }]}
        style={{ marginBottom: 20, textAlign: "left" }}
      >
        <Input
          placeholder="Nhập địa chỉ cụ thể"
          onBlur={async (event) => {
            setSummaryAddress(
              `${event.target.value}, ${ward?.path_with_type ?? ""}`
            );
          }}
        />
      </Form.Item>

      <Form.Item label="Địa chỉ">
        <Input disabled value={summaryAddress} />
      </Form.Item>

      <Form.Item
        label="Email nhận hóa đơn điện tử"
        name="faxEmail"
        validateTrigger="onBlur"
        rules={[
          {
            required: true,
            message: "Email nhận hóa đơn điện tử không được trống",
          },
          { type: "email", message: "Email không hợp lệ" },
          { max: 50, message: "Email không được vượt quá 50 ký tự" },
        ]}
        style={{ marginBottom: 20, textAlign: "left" }}
      >
        <Input
          showCount
          maxLength={50}
          placeholder="Nhập email nhận hóa đơn điện tử"
        />
      </Form.Item>

      <Form.Item
        label="Mã số thuế"
        name="faxCode"
        validateTrigger="onBlur"
        rules={[{ required: true, message: "Mã số thuế không được trống" }]}
        style={{ marginBottom: 0, textAlign: "left" }}
      >
        <Input placeholder="Nhập mã số thuế" />
      </Form.Item>
    </div>
  );
};

export default StoreFaxFormItem;
