import { Typography, Tabs, Table, DatePicker, Input, Button, Space, Flex, Card, Tag, Modal, Form } from 'antd';
import { useState } from 'react';
import type { TabsProps, TableProps } from 'antd';
import dayjs from 'dayjs';
import OrderDetailScreen from './OrderDetailScreen';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Order {
    id: string;
    customerInfo: {
        name: string;
        phone: string;
        address: string;
    };
    products: Array<{ // Assuming structure based on image
        name: string;
        quantity: number;
        price: number;
        image: string;
    }>;
    totalAmount: number;
    status: string;
    orderDate: string; // Placeholder for date
    paymentMethod: string; // Add payment method field
    note?: string; // Add note field
    pickupTime?: string; // Add pickup time field
}

const OrderManagementScreen = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [orders, setOrders] = useState<Order[]>([]); // Placeholder for order data
    const [isDeliveryModalVisible, setIsDeliveryModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [form] = Form.useForm();
    const [showDetail, setShowDetail] = useState(false);

    // Placeholder data based on the image structure
    const dummyOrders: Order[] = [
        {
            id: '2155996871212',
            customerInfo: {
                name: 'longah',
                phone: '0364341107',
                address: '328/68 Xô Viết Nghệ Tĩnh',
            },
            products: [
                {
                    name: 'HẠT CHO MÈO CƯNG THƠM NGON BỔ DƯỠNG',
                    quantity: 1,
                    price: 200000,
                    image: 'placeholder.jpg', // Replace with actual image path/logic
                },
            ],
            totalAmount: 200000,
            status: 'Chờ xác nhận',
            orderDate: '2023-10-27', // Placeholder
            paymentMethod: 'Thanh toán khi nhận hàng', // Placeholder payment method
            note: 'Giao hàng vào buổi chiều'
        },
         {
            id: '2155996871213',
            customerInfo: {
                name: 'longah',
                phone: '0364341107',
                address: '328/68 Xô Viết Nghệ Tĩnh',
            },
            products: [
                {
                    name: 'HẠT CHO MÈO CƯNG THƠM NGON BỔ DƯỠNG',
                    quantity: 1,
                    price: 200000,
                    image: 'placeholder.jpg', // Replace with actual image path/logic
                },
                 {
                    name: 'HẠT CHO MÈO CƯNG THƠM NGON BỔ DƯỠNG',
                    quantity: 1,
                    price: 200000,
                    image: 'placeholder.jpg', // Replace with actual image path/logic
                },
            ],
            totalAmount: 400000,
            status: 'Đã giao',
            orderDate: '2023-10-27', // Placeholder
            paymentMethod: 'Đã thanh toán online', // Placeholder payment method
        }
    ];

    const handleConfirmOrder = (orderId: string) => {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId 
                    ? { ...order, status: 'Chờ lấy hàng' }
                    : order
            )
        );
    };

    const handleDeliveryClick = (order: Order) => {
        setSelectedOrder(order);
        setIsDeliveryModalVisible(true);
    };

    const handleDeliveryModalOk = () => {
        form.validateFields().then(values => {
            // Update order with pickup time while keeping status as Chờ lấy hàng
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === selectedOrder?.id 
                        ? { 
                            ...order, 
                            pickupTime: values.pickupDateTime ? dayjs(values.pickupDateTime).format('DD/MM/YYYY HH:mm') : 'Hôm nay'
                        }
                        : order
                )
            );
            setIsDeliveryModalVisible(false);
            form.resetFields();
        });
    };

    const handleDeliveryModalCancel = () => {
        setIsDeliveryModalVisible(false);
        form.resetFields();
    };

    const handleConfirmDelivery = (orderId: string) => {
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId 
                    ? { ...order, status: 'Đang giao' }
                    : order
            )
        );
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowDetail(true);
    };

    const isAfterNoon = () => {
        return dayjs().hour() >= 12;
    };

    // Define table columns
    const columns: TableProps<Order>['columns'] = [
        {
            title: 'Mã đơn hàng',
            dataIndex: 'id',
            key: 'id',
            width: 150,
            fixed: 'left',
            ellipsis: true,
        },
        {
            title: 'Sản phẩm',
            dataIndex: 'products',
            key: 'products',
            width: 300,
            render: (products: Array<{ name: string; quantity: number; price: number; image: string }>, record: Order, index: number) => (
                <Space direction="vertical">
                    {products.map((product, index) => (
                        <Flex key={index} align="center">
                            <img src={product.image} alt={product.name} style={{ width: 50, marginRight: 10 }} />
                            <Text style={{ wordBreak: 'break-word' }}>{product.name}</Text>
                        </Flex>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Số lượng',
            dataIndex: 'products',
            key: 'quantity',
            width: 100,
            align: 'center',
            render: (products: Array<{ quantity: number }>) => {
                const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);
                return <Text>{totalQuantity}</Text>;
            }
        },
        {
            title: 'Tổng đơn hàng',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 200,
            render: (amount: number, record: Order) => (
                <Space direction="vertical" size={0}>
                    <Text>{amount.toLocaleString('vi-VN')}VND</Text>
                    <Text type="secondary" style={{ fontSize: '12px', wordBreak: 'break-word' }}>{record.paymentMethod}</Text>
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 200,
            render: (status: string, record: Order) => {
                let color = 'geekblue';
                if (status === 'Chờ xác nhận') {
                    color = 'volcano';
                } else if (status === 'Chờ lấy hàng') {
                    color = 'orange';
                } else if (status === 'Đang giao') {
                    color = 'blue';
                } else if (status === 'Đã giao') {
                    color = 'green';
                }
                return (
                    <Space direction="vertical" size={0}>
                        <Tag color={color} key={status}>
                            {status.toUpperCase()}
                        </Tag>
                        {status === 'Chờ xác nhận' && (
                            <Text type="secondary" style={{ fontSize: '12px', wordBreak: 'break-word' }}>
                                Để tránh đơn hàng bị chậm trễ vui lòng xác nhận trước 12 giờ
                            </Text>
                        )}
                        {status === 'Chờ lấy hàng' && record.pickupTime && (
                            <Text type="secondary" style={{ fontSize: '12px', wordBreak: 'break-word' }}>
                                Ngày lấy hàng: {record.pickupTime}
                            </Text>
                        )}
                    </Space>
                );
            },
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            width: 250,
            render: (note: string) => (
                <Text style={{ wordBreak: 'break-word' }}>{note || '-'}</Text>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 200,
            fixed: 'right',
            render: (_: any, record: Order) => (
                <Space direction="vertical" size="small">
                    {record.status === 'Chờ xác nhận' && (
                        <Button type="link" onClick={() => handleConfirmOrder(record.id)}>
                            Xác nhận đơn hàng
                        </Button>
                    )}
                    {record.status === 'Chờ lấy hàng' && !record.pickupTime && (
                        <Button 
                            type="link" 
                            style={{ whiteSpace: 'normal', height: 'auto', textAlign: 'left' }}
                            onClick={() => handleDeliveryClick(record)}
                        >
                            Bàn giao cho đơn vị vận chuyển
                        </Button>
                    )}
                    {record.status === 'Chờ lấy hàng' && record.pickupTime && (
                        <Button 
                            type="link" 
                            onClick={() => handleConfirmDelivery(record.id)}
                        >
                            Xác nhận đã bàn giao
                        </Button>
                    )}
                    {record.status === 'Đã giao' && (
                        <Button type="link" onClick={() => handleViewDetails(record)}>Xem chi tiết đơn hàng</Button>
                    )}
                </Space>
            ),
        },
    ];

     const expandedRowRender = (record: Order) => {
    return (
      <Card title="Thông tin khách hàng" size="small">
        <Space direction="vertical">
          <Text><i className="ri-user-line" style={{ marginRight: 8 }}></i>Khách hàng: {record.customerInfo.name}</Text>
          <Text><i className="ri-phone-line" style={{ marginRight: 8 }}></i>SĐT: {record.customerInfo.phone}</Text>
          <Text><i className="ri-map-pin-line" style={{ marginRight: 8 }}></i>Địa chỉ: {record.customerInfo.address}</Text>
        </Space>
         {/* Add product list inside expanded row if needed, but image suggests it's in main row */}
      </Card>
    );
  };

    const tabItems: TabsProps['items'] = [
        { key: 'all', label: 'Tất cả' },
        { key: 'pending', label: 'Chờ xác nhận' },
        { key: 'picking', label: 'Chờ lấy hàng' },
        { key: 'shipping', label: 'Đang giao' },
        { key: 'delivered', label: 'Đã giao' },
        { key: 'returns', label: 'Trả hàng/Hoàn tiền/Đã hủy' },
    ];

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        // TODO: Fetch orders based on the selected tab key
    };

    // Load dummy data on component mount for demonstration
    useState(() => {
        setOrders(dummyOrders);
    });

    // Add a back button or similar if you navigate to detail view
    if (showDetail && selectedOrder) {
        return <OrderDetailScreen order={selectedOrder} />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Quản Lý Đơn Hàng</Title>
            <Card style={{ marginTop: 20, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                 <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                    <Text strong>Danh Sách Đơn Hàng</Text>
                    <Space>
                         <RangePicker />
                         {/* Add other filters/search here if needed */}
                    </Space>
                 </Flex>
                <Tabs activeKey={activeTab} items={tabItems} onChange={handleTabChange} />
                 <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    expandable={{ expandedRowRender }}
                    pagination={false} // Use custom pagination below
                    scroll={{ x: 1500 }}
                 />
                 {/* Add custom pagination here if needed, similar to ServicesScreen */}
            </Card>

            <Modal
                title="Chuẩn bị hàng"
                open={isDeliveryModalVisible}
                onOk={handleDeliveryModalOk}
                onCancel={handleDeliveryModalCancel}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    {isAfterNoon() ? (
                        <Form.Item
                            name="pickupDateTime"
                            label="Thời gian lấy hàng"
                            rules={[{ required: true, message: 'Vui lòng chọn thời gian lấy hàng' }]}
                        >
                            <DatePicker 
                                showTime 
                                format="DD/MM/YYYY HH:mm"
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                                disabledTime={(date) => {
                                    if (date && date.isSame(dayjs(), 'day')) {
                                        const currentHour = dayjs().hour();
                                        return {
                                            disabledHours: () => {
                                                const hours = [];
                                                // Disable hours before current hour
                                                for (let i = 0; i < currentHour; i++) {
                                                    hours.push(i);
                                                }
                                                // Disable hours after 17 (5 PM)
                                                for (let i = 18; i < 24; i++) {
                                                    hours.push(i);
                                                }
                                                // Disable hours before 7 AM
                                                for (let i = 0; i < 7; i++) {
                                                    hours.push(i);
                                                }
                                                return hours;
                                            },
                                            disabledMinutes: (selectedHour) => {
                                                if (date && date.isSame(dayjs(), 'day') && selectedHour === dayjs().hour()) {
                                                    return Array.from(
                                                        { length: dayjs().minute() + 1 },
                                                        (_, i) => i
                                                    );
                                                }
                                                return [];
                                            }
                                        };
                                    }
                                    return {
                                        disabledHours: () => {
                                            const hours = [];
                                            // Disable hours after 17 (5 PM)
                                            for (let i = 18; i < 24; i++) {
                                                hours.push(i);
                                            }
                                            // Disable hours before 7 AM
                                            for (let i = 0; i < 7; i++) {
                                                hours.push(i);
                                            }
                                            return hours;
                                        }
                                    };
                                }}
                                minuteStep={15}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    ) : (
                        <Text type="secondary">Đơn hàng sẽ được lấy trong ngày hôm nay</Text>
                    )}
                    <Form.Item
                        name="note"
                        label="Lưu ý cho đơn vị vận chuyển"
                    >
                        <TextArea rows={4} placeholder="Nhập lưu ý cho đơn vị vận chuyển" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default OrderManagementScreen; 