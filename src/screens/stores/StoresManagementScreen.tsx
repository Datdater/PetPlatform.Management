import { Typography, Table, Input, Space, Card, Tag } from 'antd';
import { useState } from 'react';

const { Title, Text } = Typography;

const fakeStores = [
  { id: '1', name: 'Pet Mart', phone: '0987654321', address: '123 Lê Lợi, Q.1', status: 1, orders: 120, bookings: 35, products: 80, services: 12 },
  { id: '2', name: 'Cute Pet', phone: '0912345678', address: '456 Trần Hưng Đạo, Q.5', status: 1, orders: 80, bookings: 22, products: 60, services: 8 },
  { id: '3', name: 'Happy Pet', phone: '0909123456', address: '789 Nguyễn Trãi, Q.3', status: 0, orders: 0, bookings: 0, products: 0, services: 0 },
  { id: '4', name: 'Pet House', phone: '0934567890', address: '12 Nguyễn Huệ, Q.1', status: 1, orders: 150, bookings: 27, products: 90, services: 15 },
  { id: '5', name: 'Pet Zone', phone: '0978123456', address: '34 Lý Thường Kiệt, Q.10', status: 1, orders: 30, bookings: 11, products: 25, services: 4 },
  { id: '6', name: 'Pet Lovers', phone: '0967123456', address: '56 Cách Mạng Tháng 8, Q.3', status: 0, orders: 0, bookings: 0, products: 0, services: 0 },
  { id: '7', name: 'Pet Paradise', phone: '0945123789', address: '78 Hai Bà Trưng, Q.1', status: 1, orders: 220, bookings: 40, products: 120, services: 20 },
  { id: '8', name: 'MewMew Shop', phone: '0932123456', address: '90 Nguyễn Đình Chiểu, Q.3', status: 1, orders: 50, bookings: 12, products: 35, services: 6 },
  { id: '9', name: 'Pet City', phone: '0923123456', address: '101 Lê Văn Sỹ, Q.Phú Nhuận', status: 0, orders: 0, bookings: 0, products: 0, services: 0 },
  { id: '10', name: 'Pet World', phone: '0911123456', address: '202 Trường Chinh, Q.Tân Bình', status: 1, orders: 90, bookings: 23, products: 55, services: 10 },
  { id: '11', name: 'Pet Family', phone: '0981123456', address: '303 Hoàng Văn Thụ, Q.Tân Bình', status: 1, orders: 70, bookings: 18, products: 40, services: 7 },
  { id: '12', name: 'Pet Home', phone: '0971123456', address: '404 Nguyễn Oanh, Q.Gò Vấp', status: 1, orders: 110, bookings: 24, products: 65, services: 11 },
  { id: '13', name: 'Pet Dream', phone: '0961123456', address: '505 Quang Trung, Q.Gò Vấp', status: 0, orders: 0, bookings: 0, products: 0, services: 0 },
  { id: '14', name: 'Pet Land', phone: '0951123456', address: '606 Phan Văn Trị, Q.Bình Thạnh', status: 1, orders: 130, bookings: 26, products: 75, services: 13 },
  { id: '15', name: 'Pet Station', phone: '0941123456', address: '707 Điện Biên Phủ, Q.Bình Thạnh', status: 1, orders: 20, bookings: 7, products: 15, services: 2 },
  { id: '16', name: 'Pet Center', phone: '0931123456', address: '808 Võ Thị Sáu, Q.3', status: 1, orders: 60, bookings: 15, products: 30, services: 5 },
  { id: '17', name: 'Pet Shop 123', phone: '0921123456', address: '909 Nguyễn Thị Minh Khai, Q.1', status: 0, orders: 0, bookings: 0, products: 0, services: 0 },
  { id: '18', name: 'Pet Boutique', phone: '0912123456', address: '1111 Lê Quang Định, Q.Bình Thạnh', status: 1, orders: 170, bookings: 38, products: 140, services: 22 },
  { id: '19', name: 'Pet House 2', phone: '0982123456', address: '1212 Nguyễn Văn Cừ, Q.5', status: 1, orders: 40, bookings: 9, products: 20, services: 3 },
  { id: '20', name: 'Pet Dream 2', phone: '0972123456', address: '1313 Nguyễn Thái Học, Q.1', status: 1, orders: 100, bookings: 21, products: 50, services: 8 },
];

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: 'Tên cửa hàng', dataIndex: 'name', key: 'name', width: 180 },
  { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: 'Địa chỉ', dataIndex: 'address', key: 'address', width: 220 },
  { title: 'Tổng sản phẩm', dataIndex: 'products', key: 'products', width: 120 },
  { title: 'Tổng dịch vụ', dataIndex: 'services', key: 'services', width: 120 },
  { title: 'Tổng đơn hàng', dataIndex: 'orders', key: 'orders', width: 120 },
  { title: 'Tổng lịch hẹn', dataIndex: 'bookings', key: 'bookings', width: 120 },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 120, render: (status: number) => status === 1 ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Khoá</Tag> },
];

const StoresManagementScreen = () => {
  const [search, setSearch] = useState('');
  const filteredStores = fakeStores.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.includes(search) ||
    s.address.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Quản lý cửa hàng</Title>
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Input.Search placeholder="Tìm kiếm cửa hàng" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} />
        </Space>
      </Card>
      <Table columns={columns} dataSource={filteredStores} rowKey="id" pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default StoresManagementScreen; 