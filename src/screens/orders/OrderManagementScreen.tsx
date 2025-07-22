import { Typography, Tabs, Table, DatePicker, Input, Button, Space, Flex, Card, Tag, Modal, Form, message, Spin, Grid, Dropdown, Menu } from 'antd';
import { useState, useMemo, useEffect } from 'react';
import type { TabsProps, TableProps } from 'antd';
import dayjs from 'dayjs';
import { fetchOrders, confirmOrder, updateOrderStatus } from '../../services/order.service';
import { IOrder, IOrderResponse } from '../../types/IOrder';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

const OrderManagementScreen = () => {
    const screens = useBreakpoint();
    const [activeTab, setActiveTab] = useState('all');
    const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const queryClient = useQueryClient();

    const { data: ordersData, isLoading } = useQuery({
        queryKey: ['orders', page, pageSize],
        queryFn: () => fetchOrders( page, pageSize)
    });

    const updateOrderStatusMutation = useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: number }) => 
            updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            message.success('Cập nhật trạng thái đơn hàng thành công');
        },
        onError: (error) => {
            console.error('Error updating order status:', error);
            message.error('Cập nhật trạng thái đơn hàng thất bại');
        }
    });

    const handleConfirmOrder = async (orderId: string) => {
        try {
            await confirmOrder(orderId);
            message.success('Xác nhận đơn hàng thành công');
            // Refresh orders after confirmation
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        } catch (error) {
            console.error('Error confirming order:', error);
            message.error('Xác nhận đơn hàng thất bại');
        }
    };

    const handleDeliveryClick = (order: IOrder) => {
        // setSelectedOrder(order); // Removed
        // setIsDeliveryModalVisible(true); // Removed
    };

    const handleDeliveryModalCancel = () => {
        setIsDeliveryModalVisible(false);
        form.resetFields();
    };

    const handlePrepareOrder = async (orderId: string) => {
        updateOrderStatusMutation.mutate({ orderId, status: 3 });
    };

    const handleShipOrder = async (orderId: string) => {
        updateOrderStatusMutation.mutate({ orderId, status: 4 }); // Shipped = 4
    };

    // const handleViewDetails = (order: IOrder) => { // Removed
    //     setSelectedOrder(order);
    //     setShowDetail(true);
    // };

    const isAfterNoon = () => {
        return dayjs().hour() >= 12;
    };

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

    // Xóa hàm mapIOrderToOrder và các chỗ sử dụng nó

    const baseColumns: TableProps<IOrder>['columns'] = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
            width: 100,
            fixed: screens.md ? 'left' : undefined,
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'orderDetailDTOs',
            key: 'products',
            width: 250,
            render: (details: IOrder['orderDetailDTOs']) => (
                <div>
                    {details.map((detail) => (
                        <div key={detail.productId} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                            <img src={detail.pictureUrl} alt={detail.productName} style={{ width: 40, height: 40, marginRight: 8, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
                            <div>
                                <div style={{ fontWeight: 600 }}>{detail.productName}</div>
                                {detail.attribute && (
                                    <div style={{ fontSize: 12, color: '#888' }}>
                                        {Object.entries(detail.attribute).map(([key, value]) => `${key}: ${value}`).join(', ')}
                                    </div>
                                )}
                                <div style={{ fontSize: 12, color: '#888' }}>SL: {detail.quantity}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'createdTime',
            key: 'orderDate',
            width: 150,
            responsive: ['sm'],
            render: (date: string) => {
                if (!date) return '';
                // Lấy ngày/tháng/năm và giờ/phút gốc từ chuỗi ISO
                const [d, t] = date.split('T');
                const [year, month, day] = d.split('-');
                const match = t.match(/(\d{2}:\d{2})/);
                const time = match ? match[1] : '';
                return <span>{`${day}/${month}/${year} ${time}`}</span>;
            },
        },
        {
            title: 'Tổng tiền (VNĐ)',
            dataIndex: 'price',
            key: 'totalAmount',
            width: 120,
            align: 'right',
            responsive: ['md'],
            render: (amount: number) => <span>{amount.toLocaleString('vi-VN')}</span>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'orderStatus',
            key: 'status',
            width: 120,
            render: (status: string) => {
                const { text, color } = mapOrderStatus(status);
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            fixed: screens.md ? 'right' : undefined,
            align: 'center',
            render: (_: any, record: IOrder) => {
                const menu = (
                    <Menu>
                        {record.orderStatus === 'PendingPayment' && (
                            <Menu.Item key="confirm" onClick={() => handleConfirmOrder(record.id)}>
                                Xác nhận
                            </Menu.Item>
                        )}
                        {record.orderStatus === 'Confirmed' && (
                            <Menu.Item key="prepare" onClick={() => handlePrepareOrder(record.id)}>
                                Chuẩn bị hàng
                            </Menu.Item>
                        )}
                        {record.orderStatus === 'Processing' && (
                            <Menu.Item key="ship" onClick={() => handleShipOrder(record.id)}>
                                Bàn giao ĐVVC
                            </Menu.Item>
                        )}
                        {/* <Menu.Item key="detail" onClick={() => handleViewDetails(record)}> // Removed
                            Xem chi tiết
                        </Menu.Item> */}
                    </Menu>
                );
                return (
                    <Dropdown overlay={menu} trigger={["click"]}>
                        <Button size="small">
                            Thao tác <DownOutlined />
                        </Button>
                    </Dropdown>
                );
            },
        },
    ];

    const columns = useMemo(() => baseColumns.filter(col => !col.responsive || screens[col.responsive[0]]), [screens]);

    const expandedRowRender = (record: IOrder) => {
        return (
            <Card title="Thông tin đơn hàng" size="small">
                <Space direction="vertical">
                    <Text><i className="ri-user-line" style={{ marginRight: 8 }}></i>Khách hàng: {record.customerName || 'N/A'}</Text>
                    <Text><i className="ri-phone-line" style={{ marginRight: 8 }}></i>SĐT: {record.customerPhone || 'N/A'}</Text>
                    <Text><i className="ri-phone-line" style={{ marginRight: 8 }}></i>Địa chỉ: {record.customerAddress || 'N/A'}</Text>
                    <Text><i className="ri-phone-line" style={{ marginRight: 8 }}></i>Giá giao hàng: {record.deliveryPrice?.toLocaleString('vi-VN') || 'N/A'} VN Đ</Text>
                </Space>
            </Card>
        );
    };

    const tabItems: TabsProps['items'] = [
        {
            key: 'all',
            label: 'Tất cả',
        },
        {
            key: 'pendingpayment',
            label: 'Chờ thanh toán',
        },
        {
            key: 'confirmed',
            label: 'Đã xác nhận',
        },
        {
            key: 'processing',
            label: 'Đang xử lý',
        },
        {
            key: 'shipped',
            label: 'Đang giao',
        },
        {
            key: 'delivered',
            label: 'Đã giao',
        },
        {
            key: 'cancelled',
            label: 'Đã hủy',
        }
    ];

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        // TODO: Fetch orders based on the selected tab key
    };

    // Đảm bảo sử dụng ordersData?.items hoặc filteredData cho Table và các logic khác
    const orders = ordersData?.items || [];
    const totalItems = ordersData?.totalCount || 0;

    // Filtered data based on active tab
    const filteredData = orders.filter(order => {
        if (activeTab === 'all') return true;
        return order.orderStatus.toLowerCase().replace(' ', '') === activeTab;
    });

    useEffect(() => {
        document.title = 'Quản lý Đơn hàng';
    }, []);

    // Removed OrderDetailScreen rendering block

    return (
        <div style={{ padding: screens.md ? '24px' : '12px' }}>
            <Title level={2}>Quản lý Đơn hàng</Title>
            <Card style={{ marginBottom: 24 }}>
                <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
                    <Space wrap>
                        <RangePicker />
                        <Input.Search placeholder="Tìm kiếm đơn hàng" style={{ width: 200 }} />
                    </Space>
                    <Text>Tổng cộng: {totalItems} đơn hàng</Text>
                </Flex>
            </Card>
            <Tabs defaultActiveKey="all" items={tabItems} onChange={handleTabChange} />
            <Spin spinning={isLoading}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    expandable={{ expandedRowRender }}
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        total: totalItems,
                        onChange: (page) => setPage(page),
                    }}
                />
            </Spin>
            <Modal
                title="Xác nhận thời gian giao hàng"
                open={isDeliveryModalVisible}
                onCancel={handleDeliveryModalCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="pickupDateTime" label="Thời gian lấy hàng">
                        <DatePicker showTime disabledDate={(current) => current && current < dayjs().startOf('day')} disabledHours={() => { const hours = []; if (!isAfterNoon()) for (let i = 0; i < 12; i++) hours.push(i); return hours; }} />
                    </Form.Item>
                    <Form.Item name="note" label="Ghi chú">
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default OrderManagementScreen; 