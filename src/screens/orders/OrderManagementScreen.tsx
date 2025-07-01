import { Typography, Tabs, Table, DatePicker, Input, Button, Space, Flex, Card, Tag, Modal, Form, message, Spin, Grid, Dropdown, Menu } from 'antd';
import { useState, useMemo, useEffect } from 'react';
import type { TabsProps, TableProps } from 'antd';
import dayjs from 'dayjs';
import OrderDetailScreen from './OrderDetailScreen';
import { fetchOrders, confirmOrder, updateOrderStatus, updateDeliveryTime } from '../../services/order.service';
import { IOrder, IOrderResponse } from '../../types/IOrder';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

interface Order {
    id: string;
    customerInfo: {
        name: string;
        phone: string;
        address: string;
    };
    products: Array<{
        name: string;
        quantity: number;
        price: number;
        image: string;
    }>;
    totalAmount: number;
    status: string;
    orderDate: string;
    paymentMethod: string;
    note?: string;
    pickupTime?: string;
}

const OrderManagementScreen = () => {
    const screens = useBreakpoint();
    const STORE_ID = '3fa85f64-5717-4562-b3fc-2c963f66afa6';
    const [activeTab, setActiveTab] = useState('all');
    const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [form] = Form.useForm();
    const [showDetail, setShowDetail] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const queryClient = useQueryClient();

    const { data: ordersData, isLoading } = useQuery({
        queryKey: ['orders', STORE_ID, page, pageSize],
        queryFn: () => fetchOrders(STORE_ID, page, pageSize)
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
        setSelectedOrder(mapIOrderToOrder(order));
        setIsDeliveryModalVisible(true);
    };

    const handleDeliveryModalOk = async () => {
        try {
            const values = await form.validateFields();
            const deliveryTime = values.pickupDateTime ? dayjs(values.pickupDateTime).format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss');
            
            if (selectedOrder) {
                await updateDeliveryTime(selectedOrder.id, deliveryTime);
                // Assuming status 'Chờ lấy hàng' corresponds to a number, e.g., 2
                // You might need to adjust the status value based on your backend logic.
                updateOrderStatusMutation.mutate({ orderId: selectedOrder.id, status: 2 });
            }
            
            message.success('Cập nhật thời gian giao hàng thành công');
            
            // Refresh orders after update
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            
            setIsDeliveryModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Error updating delivery time:', error);
            message.error('Cập nhật thời gian giao hàng thất bại');
        }
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

    const handleViewDetails = (order: IOrder) => {
        setSelectedOrder(mapIOrderToOrder(order));
        setShowDetail(true);
    };

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
            case 'Delivered': return { text: 'Đã giao hàng', color: 'success' };
            case 'Cancelled': return { text: 'Đã hủy', color: 'error' };
            case 'PaymentFailed': return { text: 'Thanh toán thất bại', color: 'error' };
            case 'Returned': return { text: 'Đã hoàn trả', color: 'magenta' };
            default: return { text: status, color: 'default' };
        }
    };

    const orders = ordersData?.items || [];
    const totalItems = ordersData?.totalItemsCount || 0;

    // Helper: Convert IOrder to UI Order
    const mapIOrderToOrder = (order: IOrder): Order => ({
        id: order.id,
        customerInfo: {
            name: '', // backend chưa trả về, cần bổ sung nếu có
            phone: '',
            address: '',
        },
        products: order.orderDetailDTOs.map((d) => ({
            name: d.productName,
            quantity: d.quantity,
            price: d.price,
            image: d.pictureUrl,
        })),
        totalAmount: order.price,
        status: order.orderStatus,
        orderDate: order.createdTime,
        paymentMethod: '', // backend chưa trả về
        note: '', // backend chưa trả về
        pickupTime: '', // backend chưa trả về
    });

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
            render: (date: string) => <span>{dayjs(date).format('DD/MM/YYYY HH:mm')}</span>,
        },
        {
            title: 'Tổng tiền (VND)',
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
                        {record.orderStatus === 'PendingPayment' && <Menu.Item key="confirm" onClick={() => handleConfirmOrder(record.id)}>Xác nhận</Menu.Item>}
                        {record.orderStatus === 'Confirmed' && <Menu.Item key="prepare" onClick={() => handlePrepareOrder(record.id)}>Chuẩn bị hàng</Menu.Item>}
                        <Menu.Item key="detail" onClick={() => handleViewDetails(record)}>Xem chi tiết</Menu.Item>
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
        const order = mapIOrderToOrder(record);
        return (
            <Card title="Thông tin đơn hàng" size="small">
                <Space direction="vertical">
                    <Text><i className="ri-user-line" style={{ marginRight: 8 }}></i>Khách hàng: {order.customerInfo?.name || 'N/A'}</Text>
                    <Text><i className="ri-phone-line" style={{ marginRight: 8 }}></i>SĐT: {order.customerInfo?.phone || 'N/A'}</Text>
                    <Text><i className="ri-map-pin-line" style={{ marginRight: 8 }}></i>Địa chỉ: {order.customerInfo?.address || 'N/A'}</Text>
                    <Text><b>Ngày đặt:</b> {dayjs(order.orderDate).format('DD/MM/YYYY HH:mm')}</Text>
                    <Text><b>Tổng tiền:</b> {order.totalAmount.toLocaleString('vi-VN')} VND</Text>
                    {order.note && <Text><b>Ghi chú:</b> {order.note}</Text>}
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
            key: 'pending',
            label: 'Chờ xử lý',
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

    // Filtered data based on active tab
    const filteredData = orders.filter(order => {
        if (activeTab === 'all') return true;
        return order.orderStatus.toLowerCase().replace(' ', '') === activeTab;
    });

    useEffect(() => {
        document.title = 'Quản lý Đơn hàng';
    }, []);

    if (showDetail && selectedOrder) {
        return <OrderDetailScreen order={selectedOrder} onBack={() => setShowDetail(false)} />;
    }

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
                onOk={handleDeliveryModalOk}
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