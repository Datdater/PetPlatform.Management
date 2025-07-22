import React from "react";
import { Row, Col, Card, Statistic, Typography } from "antd";
import { UserOutlined, ShopOutlined, AppstoreOutlined, PieChartOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/charts";
import { GiSittingDog } from "react-icons/gi";
import { FaUsers, FaStore, FaBoxOpen, FaConciergeBell, FaStar, FaBook } from "react-icons/fa";
import { LineChart, lineElementClasses, areaElementClasses } from '@mui/x-charts/LineChart';

const AdminDashboard = () => {
  // Fake data cho admin
  const totalUsers = 320;
  const totalStores = 45;
  const totalProducts = 780;
  const totalServices = 210;
  const totalBlogs = 67;
  const totalPets = 1540;
  const totalProductReviews = 4200;
  const avgProductRating = 4.5;
  const totalServiceReviews = 3100;
  const avgServiceRating = 4.3;

  // Dữ liệu cho chart demo
  const pieData = [
    { type: "Cửa hàng", value: totalStores },
    { type: "Dịch vụ", value: totalServices },
    { type: "Sản phẩm", value: totalProducts },
    { type: "Người dùng", value: totalUsers },
  ];

  // Dữ liệu giả cho doanh thu tổng hợp
  const revenueData = [
    { name: "Cửa hàng A", revenue: 120_000_000 },
    { name: "Cửa hàng B", revenue: 85_000_000 },
    { name: "Cửa hàng C", revenue: 150_000_000 },
    { name: "Cửa hàng D", revenue: 60_000_000 },
  ];

  // Dữ liệu giả cho tăng trưởng user
  const userGrowthData = [
    { name: "Tháng 1", revenue: 120 },
    { name: "Tháng 2", revenue: 150 },
    { name: "Tháng 3", revenue: 200 },
    { name: "Tháng 4", revenue: 320 },
  ];

  // Dữ liệu cho LineChart (fake, theo tuần từ đầu tháng 5/2025 đến cuối tháng 7/2025, 13 tuần, max 5 triệu)
  const revenueLineData = [
    { date: new Date(2025, 4, 5), storeA: 1200000, storeB: 2500000, storeC: 1800000, storeD: 2200000 },
    { date: new Date(2025, 4, 12), storeA: 800000, storeB: 3000000, storeC: 1200000, storeD: 1700000 },
    { date: new Date(2025, 4, 19), storeA: 2000000, storeB: 1500000, storeC: 2500000, storeD: 900000 },
    { date: new Date(2025, 4, 26), storeA: 3500000, storeB: 1000000, storeC: 3000000, storeD: 4000000 },
    { date: new Date(2025, 5, 2), storeA: 1000000, storeB: 2000000, storeC: 500000, storeD: 800000 },
    { date: new Date(2025, 5, 9), storeA: 4000000, storeB: 500000, storeC: 3500000, storeD: 2000000 },
    { date: new Date(2025, 5, 16), storeA: 2500000, storeB: 4000000, storeC: 2000000, storeD: 1000000 },
    { date: new Date(2025, 5, 23), storeA: 3000000, storeB: 2000000, storeC: 1000000, storeD: 500000 },
    { date: new Date(2025, 5, 30), storeA: 500000, storeB: 3500000, storeC: 4000000, storeD: 2000000 },
    { date: new Date(2025, 6, 7), storeA: 2000000, storeB: 1000000, storeC: 3000000, storeD: 4000000 },
    { date: new Date(2025, 6, 14), storeA: 4500000, storeB: 2000000, storeC: 500000, storeD: 1000000 },
    { date: new Date(2025, 6, 21), storeA: 1000000, storeB: 500000, storeC: 2000000, storeD: 3000000 },
    { date: new Date(2025, 6, 28), storeA: 3000000, storeB: 4000000, storeC: 1000000, storeD: 500000 },
  ];
  const userGrowthLineData = [
    { date: new Date(2025, 4, 5), users: 18 },
    { date: new Date(2025, 4, 12), users: 25 },
    { date: new Date(2025, 4, 19), users: 12 },
    { date: new Date(2025, 4, 26), users: 30 },
    { date: new Date(2025, 5, 2), users: 22 },
    { date: new Date(2025, 5, 9), users: 35 },
    { date: new Date(2025, 5, 16), users: 28 },
    { date: new Date(2025, 5, 23), users: 40 },
    { date: new Date(2025, 5, 30), users: 15 },
    { date: new Date(2025, 6, 7), users: 32 },
    { date: new Date(2025, 6, 14), users: 27 },
    { date: new Date(2025, 6, 21), users: 38 },
    { date: new Date(2025, 6, 28), users: 20 },
  ];

  // Cấu hình cho Column chart
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
      formatter: (datum: { revenue: number }) => `${datum.revenue.toLocaleString()}${title === 'Tăng trưởng người dùng' ? '' : '₫'}`,
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
        formatter: (v: string | number) => title === 'Tăng trưởng người dùng' ? v : `${(+v / 1_000_000).toFixed(1)}tr`,
        style: { fontWeight: 600, fontSize: 14, fill: "#383E49" },
      },
      title: { text: title === 'Tăng trưởng người dùng' ? 'Số lượng' : 'Doanh thu (VNĐ)', style: { fontWeight: 700, fontSize: 17, fill: "#1570EF" } },
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
          <span style='color:#383E49;font-weight:500'>${title === 'Tăng trưởng người dùng' ? 'Số lượng:' : 'Doanh thu:'}</span> <span style="color:#22C55E;font-weight:700;font-size:16px">${items[0].data.revenue.toLocaleString()}${title === 'Tăng trưởng người dùng' ? '' : '₫'}</span>
        </div>`;
      },
    },
    animation: { appear: { animation: "scale-in-y", duration: 900 } },
    height: 260,
    meta: {
      revenue: { alias: title === 'Tăng trưởng người dùng' ? 'Số lượng' : 'Doanh thu (VNĐ)' },
    },
    legend: false,
    interactions: [{ type: "active-region" }],
  });

  React.useEffect(() => {
    document.title = "Thống kê quản trị";
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2} style={{ marginBottom: 24 }}>
        Thống kê quản trị hệ thống
      </Typography.Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={totalUsers}
              prefix={<FaUsers style={{ color: '#5abab5', fontSize: 22, verticalAlign: 'middle' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng cửa hàng"
              value={totalStores}
              prefix={<FaStore style={{ color: '#f59e42', fontSize: 22, verticalAlign: 'middle' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng sản phẩm"
              value={totalProducts}
              prefix={<FaBoxOpen style={{ color: '#36cfc9', fontSize: 22, verticalAlign: 'middle' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng dịch vụ"
              value={totalServices}
              prefix={<FaConciergeBell style={{ color: '#fadb14', fontSize: 22, verticalAlign: 'middle' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số Blog"
              value={totalBlogs}
              prefix={<span role="img" aria-label="blog">📝</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số thú cưng"
              value={totalPets}
              prefix={<span role="img" aria-label="pet">🐾</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={
                <span>
                  Đánh giá Sản phẩm
                </span>
              }
              value={`${totalProductReviews} / ${avgProductRating}★`}
              prefix={<span role="img" aria-label="review">⭐</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={
                <span>
                  Đánh giá Dịch vụ
                </span>
              }
              value={`${totalServiceReviews} / ${avgServiceRating}★`}
              prefix={<span role="img" aria-label="review">⭐</span>}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
        <Col xs={24} md={12}>
          <Card title="Doanh thu các cửa hàng theo thời gian">
            <LineChart
              dataset={revenueLineData}
              sx={{
                [`& .${lineElementClasses.root}`]: {
                  strokeDasharray: '10 5',
                  strokeWidth: 4,
                },
                [`& .${areaElementClasses.root}[data-series="Store C"]`]: {
                  fill: "url('#myGradient')",
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
                { id: 'Store A', dataKey: 'storeA', stack: 'total', area: true, showMark: false },
                { id: 'Store B', dataKey: 'storeB', stack: 'total', area: true, showMark: false },
                { id: 'Store C', dataKey: 'storeC', stack: 'total', area: true, showMark: false },
                { id: 'Store D', dataKey: 'storeD', stack: 'total', area: true, showMark: false },
              ]}
              experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
              height={300}
            >
              <defs>
                <linearGradient id="myGradient" gradientTransform="rotate(90)">
                  <stop offset="5%" stopColor="#5abab5" />
                  <stop offset="95%" stopColor="#f59e42" />
                </linearGradient>
              </defs>
            </LineChart>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Tăng trưởng người dùng theo thời gian">
            <LineChart
              dataset={userGrowthLineData}
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
                valueFormatter: (date: Date) => date.getFullYear().toString() + '-' + (date.getMonth() + 1),
              }]}
              yAxis={[{ width: 80 }]}
              series={[
                { id: 'Users', dataKey: 'users', area: true, showMark: false },
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

export default AdminDashboard; 