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
import { LineChart, lineElementClasses, areaElementClasses } from '@mui/x-charts/LineChart';
import { FaUsers, FaStore, FaBoxOpen, FaConciergeBell, FaStar, FaBook } from "react-icons/fa";

const StoresScreen = () => {
  // Dữ liệu thống kê cửa hàng
  const totalReviews = 126;
  const totalServices = 3;
  const totalProducts = 5;

  // Dữ liệu giả cho doanh thu sản phẩm theo cửa hàng (giảm số tiền)
  const productRevenueData = [
    { name: 'Pet Paradise', revenue: 500000 },
    { name: 'Happy Paws', revenue: 350000 },
    { name: 'Pet World', revenue: 700000 },
    { name: 'Animal Care', revenue: 200000 },
  ];

  // Dữ liệu giả cho doanh thu dịch vụ theo cửa hàng (giảm số tiền)
  const serviceRevenueData = [
    { name: 'Pet Paradise', revenue: 300000 },
    { name: 'Happy Paws', revenue: 400000 },
    { name: 'Pet World', revenue: 250000 },
    { name: 'Animal Care', revenue: 100000 },
  ];

  // Tính tổng doanh thu thực tế
  const totalRevenue = [...productRevenueData, ...serviceRevenueData].reduce((sum, item) => sum + item.revenue, 0);

  // Dữ liệu cho LineChart - Doanh thu theo thời gian (giảm số tiền)
  const revenueLineData = [
    { date: new Date(2025, 4, 5), productRevenue: 120000, serviceRevenue: 80000 },
    { date: new Date(2025, 4, 12), productRevenue: 90000, serviceRevenue: 110000 },
    { date: new Date(2025, 4, 19), productRevenue: 150000, serviceRevenue: 70000 },
    { date: new Date(2025, 4, 26), productRevenue: 130000, serviceRevenue: 120000 },
    { date: new Date(2025, 5, 2), productRevenue: 80000, serviceRevenue: 90000 },
    { date: new Date(2025, 5, 9), productRevenue: 160000, serviceRevenue: 60000 },
    { date: new Date(2025, 5, 16), productRevenue: 110000, serviceRevenue: 130000 },
    { date: new Date(2025, 5, 23), productRevenue: 140000, serviceRevenue: 90000 },
    { date: new Date(2025, 5, 30), productRevenue: 70000, serviceRevenue: 150000 },
    { date: new Date(2025, 6, 7), productRevenue: 120000, serviceRevenue: 110000 },
    { date: new Date(2025, 6, 14), productRevenue: 170000, serviceRevenue: 80000 },
    { date: new Date(2025, 6, 21), productRevenue: 90000, serviceRevenue: 140000 },
    { date: new Date(2025, 6, 28), productRevenue: 130000, serviceRevenue: 100000 },
    { date: new Date(2025, 7, 5), productRevenue: 200000, serviceRevenue: 180000 },
  ];

  // Dữ liệu tăng trưởng đánh giá theo thời gian (14 tuần từ tháng 5-7/2025, kết thúc 27/7)
  const reviewGrowthLineData = [
    { date: new Date(2025, 4, 5), reviews: 28 },
    { date: new Date(2025, 4, 12), reviews: 35 },
    { date: new Date(2025, 4, 19), reviews: 22 },
    { date: new Date(2025, 4, 26), reviews: 42 },
    { date: new Date(2025, 5, 2), reviews: 31 },
    { date: new Date(2025, 5, 9), reviews: 48 },
    { date: new Date(2025, 5, 16), reviews: 38 },
    { date: new Date(2025, 5, 23), reviews: 55 },
    { date: new Date(2025, 5, 30), reviews: 29 },
    { date: new Date(2025, 6, 7), reviews: 44 },
    { date: new Date(2025, 6, 14), reviews: 39 },
    { date: new Date(2025, 6, 21), reviews: 51 },
    { date: new Date(2025, 6, 28), reviews: 33 },
    { date: new Date(2025, 7, 5), reviews: 67 },
  ];

  // Cấu hình cho Column chart (giống AdminDashboard)
  const columnConfig = (data: { name: string; revenue: number }[], title: string) => ({
    data,
    xField: "name",
    yField: "revenue",
    label: {
      position: "top",
      style: {
        fill: "#1570EF",
        fontWeight: 700,
        fontSize: 15,
        textShadow: "0 1px 2px #fff",
      },
      formatter: (datum: { revenue: number }) => `${datum.revenue.toLocaleString()}₫`,
    },
    xAxis: {
      label: {
        style: { fontWeight: 600, fontSize: 14, fill: "#383E49" },
      },
      title: { text: title, style: { fontWeight: 700, fontSize: 17, fill: "#1570EF" } },
      line: { style: { stroke: "#1570EF", lineWidth: 2 } },
    },
    yAxis: {
      label: {
        formatter: (v: string | number) => `${(+v / 1_000_000).toFixed(1)}tr`,
        style: { fontWeight: 600, fontSize: 14, fill: "#383E49" },
      },
      title: { text: 'Doanh thu (VNĐ)', style: { fontWeight: 700, fontSize: 17, fill: "#1570EF" } },
      grid: { line: { style: { stroke: "#E0E7EF", lineDash: [4, 4] } } },
    },
    color: ({ name }: { name: string }) => {
      const palette = [
        "l(90) 0:#1570EF 1:#5EEAD4",
        "l(90) 0:#22C55E 1:#FDE68A",
        "l(90) 0:#F59E42 1:#F43F5E",
        "l(90) 0:#F43F5E 1:#A21CAF",
      ];
      return palette[data.findIndex((d: { name: string }) => d.name === name) % palette.length];
    },
    columnStyle: {
      radius: [12, 12, 0, 0],
      fillOpacity: 0.95,
      shadowColor: "#aaa",
      shadowBlur: 10,
    },
    tooltip: {
      customContent: (title: string, items: any[]) => {
        if (!items.length) return "";
        return `<div style="padding:10px 16px;min-width:140px;">
          <b style='font-size:15px;color:#1570EF'>${items[0].data.name}</b><br/>
          <span style='color:#383E49;font-weight:500'>Doanh thu:</span> <span style="color:#22C55E;font-weight:700;font-size:16px">${items[0].data.revenue.toLocaleString()}₫</span>
        </div>`;
      },
    },
    animation: { appear: { animation: "scale-in-y", duration: 900 } },
    height: 260,
    meta: {
      revenue: { alias: 'Doanh thu (VNĐ)' },
    },
    legend: false,
    interactions: [{ type: "active-region" }],
  });

  useEffect(() => {
    document.title = "Thống kê cửa hàng";
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2} style={{ marginBottom: 24 }}>
        Thống kê cửa hàng
      </Typography.Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng lượt đánh giá"
              value={totalReviews}
              prefix={<FaStar style={{ color: '#fadb14', fontSize: 22, verticalAlign: 'middle' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng dịch vụ"
              value={totalServices}
              prefix={<FaConciergeBell style={{ color: '#36cfc9', fontSize: 22, verticalAlign: 'middle' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={totalProducts}
              prefix={<FaBoxOpen style={{ color: '#5abab5', fontSize: 22, verticalAlign: 'middle' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={totalRevenue.toLocaleString()}
              prefix={<span role="img" aria-label="money" style={{ fontSize: 22 }}>💰</span>}
              suffix="₫"
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} md={12}>
          <Card title="Doanh thu Sản phẩm & Dịch vụ theo thời gian">
            <LineChart
              dataset={revenueLineData}
              sx={{
                [`& .${lineElementClasses.root}`]: {
                  strokeDasharray: '10 5',
                  strokeWidth: 4,
                },
                [`& .${areaElementClasses.root}[data-series="Service Revenue"]`]: {
                  fill: "url('#serviceGradient')",
                  filter: 'none',
                },
              }}
              xAxis={[{
                id: 'Thời gian',
                dataKey: 'date',
                scaleType: 'time',
                valueFormatter: (date: Date) => `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`,
              }]}
              yAxis={[{ width: 80, valueFormatter: (v: number) => `${(v/1_000_000).toFixed(0)}tr` }]}
              series={[
                { id: 'Product Revenue', dataKey: 'productRevenue', stack: 'total', area: true, showMark: false },
                { id: 'Service Revenue', dataKey: 'serviceRevenue', stack: 'total', area: true, showMark: false },
              ]}
              experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
              height={300}
            >
              <defs>
                <linearGradient id="serviceGradient" gradientTransform="rotate(90)">
                  <stop offset="5%" stopColor="#36cfc9" />
                  <stop offset="95%" stopColor="#fadb14" />
                </linearGradient>
              </defs>
            </LineChart>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Tăng trưởng đánh giá theo thời gian">
            <LineChart
              dataset={reviewGrowthLineData}
              sx={{
                [`& .${lineElementClasses.root}`]: {
                  strokeDasharray: '10 5',
                  strokeWidth: 4,
                },
              }}
              xAxis={[{
                id: 'Thời gian',
                dataKey: 'date',
                scaleType: 'time',
                valueFormatter: (date: Date) => `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`,
              }]}
              yAxis={[{ width: 80 }]}
              series={[
                { id: 'Reviews', dataKey: 'reviews', area: true, showMark: false },
              ]}
              experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
              height={300}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StoresScreen;