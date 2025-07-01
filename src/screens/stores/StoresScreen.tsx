import {
  Button,
  Drawer,
  Flex,
  Space,
  Spin,
  Table,
  TableProps,
  Tooltip,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Progress,
} from "antd";
import { useEffect, useState } from "react";
import { colors } from "../../constants/colors";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineReload } from "react-icons/ai";
import { useNavigate } from "react-router";
import useFetchStores from "../../hooks/store/useFetchStores";
import { IStore } from "../../types/IStore";
import StoreDetail from "../../components/features/stores/StoreDetail";
import { useQueryClient } from "@tanstack/react-query";
import { PieChartOutlined, ShopOutlined, UserOutlined, AppstoreOutlined } from "@ant-design/icons";

// interface DataType {
//   key: string;
//   name: string;
//   age: number;
//   address: string;
//   tags: string[];
// }

// const data: DataType[] = [
//   {
//     key: "1",
//     name: "John Brown",
//     age: 32,
//     address: "New York No. 1 Lake Park",
//     tags: ["nice", "developer"],
//   },
//   {
//     key: "2",
//     name: "Jim Green",
//     age: 42,
//     address: "London No. 1 Lake Park",
//     tags: ["loser"],
//   },
//   {
//     key: "3",
//     name: "Joe Black",
//     age: 32,
//     address: "Sydney No. 1 Lake Park",
//     tags: ["cool", "teacher"],
//   },
// ];

const StoresScreen = () => {
  // Giả lập số liệu dashboard
  const totalStores = 12;
  const totalServices = 34;
  const totalProducts = 120;
  const totalUsers = 56;

  // Dữ liệu cho chart demo
  const pieData = [
    { type: "Cửa hàng", value: totalStores },
    { type: "Dịch vụ", value: totalServices },
    { type: "Sản phẩm", value: totalProducts },
    { type: "Người dùng", value: totalUsers },
  ];

  useEffect(() => {
    document.title = "Store Dashboard";
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2} style={{ marginBottom: 24 }}>
        Dashboard
      </Typography.Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng cửa hàng"
              value={totalStores}
              prefix={<ShopOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng dịch vụ"
              value={totalServices}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={totalProducts}
              prefix={<PieChartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} md={12}>
          <Card title="Tỉ lệ phân bổ">
            <div style={{ textAlign: "center" }}>
              <Progress type="dashboard" percent={Math.round((totalStores / (totalStores + totalServices + totalProducts + totalUsers)) * 100)} format={percent => `Cửa hàng: ${percent}%`} />
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Biểu đồ demo">
            <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PieChartOutlined style={{ fontSize: 80, color: colors.primary500 }} />
              <span style={{ marginLeft: 16, fontSize: 18, color: colors.primary500 }}>Biểu đồ sẽ hiển thị ở đây (có thể tích hợp thêm thư viện chart)</span>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StoresScreen;
