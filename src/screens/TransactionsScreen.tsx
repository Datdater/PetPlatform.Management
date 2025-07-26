import { Table, Typography, Card, Input, Space, Tag } from 'antd';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactions, ITransaction, ITransactionResponse } from '../services/transactions.service';

const { Title } = Typography;

const mapTransactionStatus = (status: string): { text: string; color: string } => {
  switch (status) {
    case 'Completed': return { text: 'Hoàn thành', color: 'success' };
    case 'Pending': return { text: 'Đang xử lý', color: 'processing' };
    case 'Failed': return { text: 'Thất bại', color: 'error' };
    case 'Cancelled': return { text: 'Đã hủy', color: 'default' };
    default: return { text: status, color: 'default' };
  }
};

const columns = [
  { title: 'Mã giao dịch', dataIndex: 'transactionId', key: 'transactionId' },
  { title: 'Người thực hiện', dataIndex: 'userName', key: 'userName' },
  { title: 'Cửa hàng', dataIndex: 'shopName', key: 'shopName' },
  { title: 'Số tiền', dataIndex: 'amount', key: 'amount', render: (v: number) => v.toLocaleString() + ' đ' },
  { title: 'Lợi nhuận', key: 'profit', render: (_: any, record: ITransaction) => (Math.round(record.amount * 0.05)).toLocaleString() + ' đ' },
  { 
    title: 'Trạng thái', 
    dataIndex: 'status', 
    key: 'status',
    render: (status: string) => {
      const { text, color } = mapTransactionStatus(status);
      return <Tag color={color}>{text}</Tag>;
    }
  },
  { title: 'Ngày', dataIndex: 'transactionDate', key: 'transactionDate', render: (v: string) => new Date(v).toLocaleDateString('vi-VN') },
];

const TransactionsScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useQuery<ITransactionResponse>({
    queryKey: ['transactions', page, pageSize],
    queryFn: () => fetchTransactions(page, pageSize),
  });

  const transactions: ITransaction[] = data?.items || [];
  const total = data?.totalCount || 0;

  const filteredData = transactions.filter(row =>
    Object.values(row).some(val =>
      typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())
    )
  );

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={2}>Quản lý giao dịch</Title>
        <Card>
          <p>Lỗi khi tải dữ liệu: {error.message}</p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Quản lý giao dịch</Title>
      <Card style={{ marginBottom: 24 }}>
        <Space>
          <Input.Search placeholder="Tìm kiếm giao dịch" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 240 }} />
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
        rowKey="transactionId"
      />
    </div>
  );
};

export default TransactionsScreen; 