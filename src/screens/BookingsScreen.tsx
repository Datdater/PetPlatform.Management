import { Table, Typography, Card, Input, Space, Tag } from 'antd';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBookings, IBookingItem, IBookingResponse } from '../services/booking.service';

const { Title } = Typography;

const mapBookingStatus = (status: number): { text: string; color: string } => {
  switch (status) {
    case 0: return { text: 'Chờ xác nhận', color: 'default' };
    case 1: return { text: 'Đã xác nhận', color: 'processing' };
    case 2: return { text: 'Đã hoàn thành', color: 'success' };
    case 3: return { text: 'Đã hủy', color: 'error' };
    default: return { text: String(status), color: 'default' };
  }
};

const columns = [
  { title: 'Mã đặt lịch', dataIndex: 'bookingId', key: 'bookingId' },
  { title: 'Khách hàng', dataIndex: 'userName', key: 'userName' },
  { title: 'Dịch vụ', dataIndex: 'petWithServices', key: 'service', render: (petWithServices: IBookingItem['petWithServices']) => petWithServices.map(pet => pet.services.map(s => s.serviceName).join(', ')).join('; ') },
  { 
    title: 'Trạng thái', 
    dataIndex: 'status', 
    key: 'status',
    render: (status: number) => {
      const { text, color } = mapBookingStatus(status);
      return <Tag color={color}>{text}</Tag>;
    }
  },
  { title: 'Ngày', dataIndex: 'bookingTime', key: 'bookingTime', render: (v: string) => new Date(v).toLocaleDateString('vi-VN') },
];

const BookingsScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useQuery<IBookingResponse>({
    queryKey: ['bookings', page, pageSize],
    queryFn: () => fetchBookings(page, pageSize),
  });

  const bookings: IBookingItem[] = data?.items || [];
  const total = data?.totalItemsCount || 0;

  const filteredData = bookings.filter(row =>
    Object.values(row).some(val =>
      typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())
    )
  );

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={2}>Quản lý đặt lịch</Title>
        <Card>
          <p>Lỗi khi tải dữ liệu: {error.message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Quản lý đặt lịch</Title>
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Input.Search placeholder="Tìm kiếm đặt lịch" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} />
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
        rowKey="bookingId"
      />
    </div>
  );
};

export default BookingsScreen; 