import { Table, Typography, Card, Input, Space, Tag } from 'antd';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '../services/order.service';
import { IOrder, IOrderResponse } from '../types/IOrder';

const { Title } = Typography;

const mapOrderStatus = (status: string): { text: string; color: string } => {
  switch (status) {
    case 'Pending': return { text: 'Chờ xử lý', color: 'default' };
    case 'PendingPayment': return { text: 'Chờ thanh toán', color: 'warning' };
    case 'Confirmed': return { text: 'Đã xác nhận', color: 'processing' };
    case 'Processing': return { text: 'Đang xử lý', color: 'blue' };
    case 'Shipped': return { text: 'Đang giao hàng', color: 'cyan' };
    case 'Delivered': return { text: 'Đã hoàn thành', color: 'success' };
    case 'Cancelled': return { text: 'Đã hủy', color: 'error' };
    case 'PaymentFailed': return { text: 'Thanh toán thất bại', color: 'error' };
    case 'Returned': return { text: 'Đã hoàn trả', color: 'magenta' };
    default: return { text: status, color: 'default' };
  }
};

const columns = [
  { title: 'Mã đơn hàng', dataIndex: 'id', key: 'id' },
  { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
  { title: 'Tổng tiền', dataIndex: 'price', key: 'price', render: (v: number) => v.toLocaleString() + ' đ' },
  { 
    title: 'Trạng thái', 
    dataIndex: 'orderStatus', 
    key: 'orderStatus',
    render: (status: string) => {
      const { text, color } = mapOrderStatus(status);
      return <Tag color={color}>{text}</Tag>;
    }
  },
  { title: 'Ngày', dataIndex: 'createdTime', key: 'createdTime', render: (v: string) => new Date(v).toLocaleDateString('vi-VN') },
];

const OrdersScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', page, pageSize],
    queryFn: () => fetchOrders(page, pageSize),
  });

  const orders: IOrder[] = data?.items || [];
  const total = data?.totalCount || 0;

  const filteredData = orders.filter(row =>
    Object.values(row).some(val =>
      typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())
    )
  );

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={2}>Quản lý đơn hàng</Title>
        <Card>
          <p>Lỗi khi tải dữ liệu: {error.message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Quản lý đơn hàng</Title>
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Input.Search placeholder="Tìm kiếm đơn hàng" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} />
        </Space>
      </Card>
      <Table
        dataSource={filteredData}
        columns={columns}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (p) => setPage(p),
        }}
        rowKey="id"
      />
    </div>
  );
};

export default OrdersScreen; 