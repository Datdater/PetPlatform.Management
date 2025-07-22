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
import { Column } from '@ant-design/charts';

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

  // Dữ liệu giả cho doanh thu sản phẩm
  const productRevenueData = [
    { name: 'Sản phẩm A', revenue: 12000000 },
    { name: 'Sản phẩm B', revenue: 8500000 },
    { name: 'Sản phẩm C', revenue: 15000000 },
    { name: 'Sản phẩm D', revenue: 6000000 },
  ];

  // Dữ liệu giả cho doanh thu dịch vụ
  const serviceRevenueData = [
    { name: 'Dịch vụ X', revenue: 9000000 },
    { name: 'Dịch vụ Y', revenue: 14000000 },
    { name: 'Dịch vụ Z', revenue: 7000000 },
    { name: 'Dịch vụ W', revenue: 11000000 },
  ];

  // Cấu hình cho Column chart (UI đẹp, hiện đại)
  const columnConfig = (data: any[], title: string) => ({
    data,
    xField: 'name',
    yField: 'revenue',
    label: {
      position: 'top',
      style: {
        fill: '#1570EF',
        fontWeight: 700,
        fontSize: 15,
        textShadow: '0 1px 2px #fff',
      },
      formatter: (datum: any) => `${datum.revenue.toLocaleString()}₫`,
    },
    xAxis: {
      label: {
        style: { fontWeight: 600, fontSize: 14, fill: '#383E49' },
      },
      title: { text: title, style: { fontWeight: 700, fontSize: 17, fill: '#1570EF' } },
      line: { style: { stroke: '#1570EF', lineWidth: 2 } },
    },
    yAxis: {
      label: {
        formatter: (v: any) => `${(+v / 1_000_000).toFixed(1)}tr`,
        style: { fontWeight: 600, fontSize: 14, fill: '#383E49' },
      },
      title: { text: 'Doanh thu (VNĐ)', style: { fontWeight: 700, fontSize: 17, fill: '#1570EF' } },
      grid: { line: { style: { stroke: '#E0E7EF', lineDash: [4, 4] } } },
    },
    color: ({ name }: any) => {
      // Gradient màu cho từng cột
      const palette = [
        'l(90) 0:#1570EF 1:#5EEAD4',
        'l(90) 0:#22C55E 1:#FDE68A',
        'l(90) 0:#F59E42 1:#F43F5E',
        'l(90) 0:#F43F5E 1:#A21CAF',
      ];
      return palette[data.findIndex(d => d.name === name) % palette.length];
    },
    columnStyle: {
      radius: [12, 12, 0, 0], // Bo góc trên
      fillOpacity: 0.95,
      shadowColor: '#aaa',
      shadowBlur: 10,
    },
    tooltip: {
      customContent: (title: string, items: any[]) => {
        if (!items.length) return '';
        return `<div style="padding:10px 16px;min-width:140px;">
          <b style='font-size:15px;color:#1570EF'>${items[0].data.name}</b><br/>
          <span style='color:#383E49;font-weight:500'>Doanh thu:</span> <span style="color:#22C55E;font-weight:700;font-size:16px">${items[0].data.revenue.toLocaleString()}₫</span>
        </div>`;
      },
    },
    animation: { appear: { animation: 'scale-in-y', duration: 900 } },
    height: 260,
    meta: {
      revenue: { alias: 'Doanh thu (VNĐ)' },
    },
    legend: false,
    interactions: [{ type: 'active-region' }],
  });

  useEffect(() => {
    document.title = "Thống kê cửa hàng";
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2} style={{ marginBottom: 24 }}>
        Thống kê
      </Typography.Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng lượt đánh giá"
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
          <Card title="Biểu đồ Doanh thu Sản phẩm">
            <Column {...columnConfig(productRevenueData, 'Sản phẩm')} />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Biểu đồ Doanh thu Dịch vụ">
            <Column {...columnConfig(serviceRevenueData, 'Dịch vụ')} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StoresScreen;
