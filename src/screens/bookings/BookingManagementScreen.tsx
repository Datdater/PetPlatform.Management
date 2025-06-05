import { Typography, Tabs, Table, DatePicker, Input, Button, Space, Flex, Card, Tag, Modal, Form } from 'antd';
import { useState } from 'react';
import type { TabsProps, TableProps } from 'antd';
import dayjs from 'dayjs';
import BookingDetailScreen from './BookingDetailScreen';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

interface Booking {
    id: string;
    customerInfo: {
        name: string;
        phone: string;
        address: string;
    };
    service: {
        name: string;
        price: number;
        duration: string;
        image: string;
    };
    petInfo: {
        name: string;
        type: string;
        breed: string;
        age: number;
    };
    totalAmount: number;
    status: string;
    bookingDate: string;
    bookingTime: string;
    paymentMethod: string;
    note?: string;
}

const BookingManagementScreen = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [bookings, setBookings] = useState<Booking[]>([]); // Placeholder for booking data
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [form] = Form.useForm();
    const [showDetail, setShowDetail] = useState(false);

    // Placeholder data
    const dummyBookings: Booking[] = [
        {
            id: 'BK001',
            customerInfo: {
                name: 'Nguyễn Văn A',
                phone: '0123456789',
                address: '123 Đường ABC, Quận XYZ, TP.HCM',
            },
            service: {
                name: 'Tắm rửa và cắt tỉa lông',
                price: 200000,
                duration: '2 giờ',
                image: 'placeholder.jpg',
            },
            petInfo: {
                name: 'Lucky',
                type: 'Chó',
                breed: 'Poodle',
                age: 2,
            },
            totalAmount: 200000,
            status: 'Chờ xác nhận',
            bookingDate: '2024-03-20',
            bookingTime: '14:00',
            paymentMethod: 'Thanh toán khi nhận dịch vụ',
            note: 'Chó của tôi hơi nhát, mong được chăm sóc nhẹ nhàng'
        },
        {
            id: 'BK002',
            customerInfo: {
                name: 'Trần Thị B',
                phone: '0987654321',
                address: '456 Đường DEF, Quận UVW, TP.HCM',
            },
            service: {
                name: 'Khám sức khỏe tổng quát',
                price: 500000,
                duration: '1 giờ',
                image: 'placeholder.jpg',
            },
            petInfo: {
                name: 'Milo',
                type: 'Mèo',
                breed: 'British Shorthair',
                age: 1,
            },
            totalAmount: 500000,
            status: 'Đã xác nhận',
            bookingDate: '2024-03-21',
            bookingTime: '10:00',
            paymentMethod: 'Đã thanh toán online',
        }
    ];

    const handleConfirmBooking = (bookingId: string) => {
        setBookings(prevBookings => 
            prevBookings.map(booking => 
                booking.id === bookingId 
                    ? { ...booking, status: 'Đã xác nhận' }
                    : booking
            )
        );
    };

    const handleCompleteBooking = (bookingId: string) => {
        setBookings(prevBookings => 
            prevBookings.map(booking => 
                booking.id === bookingId 
                    ? { ...booking, status: 'Hoàn thành' }
                    : booking
            )
        );
    };

    const handleViewDetails = (booking: Booking) => {
        setSelectedBooking(booking);
        setShowDetail(true);
    };

    // Define table columns
    const columns: TableProps<Booking>['columns'] = [
        {
            title: 'Mã đặt lịch',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            fixed: 'left',
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'service',
            key: 'service',
            width: 250,
            render: (service: { name: string; price: number; duration: string; image: string }) => (
                <Space direction="vertical">
                    <Flex align="center">
                        <img src={service.image} alt={service.name} style={{ width: 50, marginRight: 10 }} />
                        <Text>{service.name}</Text>
                    </Flex>
                    <Text type="secondary">Thời gian: {service.duration}</Text>
                </Space>
            ),
        },
        {
            title: 'Thú cưng',
            dataIndex: 'petInfo',
            key: 'petInfo',
            width: 200,
            render: (petInfo: { name: string; type: string; breed: string; age: number }) => (
                <Space direction="vertical">
                    <Text>{petInfo.name}</Text>
                    <Text type="secondary">{petInfo.type} - {petInfo.breed}</Text>
                    <Text type="secondary">Tuổi: {petInfo.age} tuổi</Text>
                </Space>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'bookingTime',
            key: 'bookingTime',
            width: 150,
            render: (time: string, record: Booking) => (
                <Space direction="vertical">
                    <Text>{record.bookingDate}</Text>
                    <Text type="secondary">{time}</Text>
                </Space>
            ),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            width: 150,
            render: (amount: number, record: Booking) => (
                <Space direction="vertical">
                    <Text>{amount.toLocaleString('vi-VN')}VND</Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>{record.paymentMethod}</Text>
                </Space>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (status: string) => {
                let color = 'geekblue';
                if (status === 'Chờ xác nhận') {
                    color = 'volcano';
                } else if (status === 'Đã xác nhận') {
                    color = 'blue';
                } else if (status === 'Hoàn thành') {
                    color = 'green';
                }
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
            width: 200,
            render: (note: string) => (
                <Text style={{ wordBreak: 'break-word' }}>{note || '-'}</Text>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_: any, record: Booking) => (
                <Space direction="vertical" size="small">
                    {record.status === 'Chờ xác nhận' && (
                        <Button type="link" onClick={() => handleConfirmBooking(record.id)}>
                            Xác nhận lịch hẹn
                        </Button>
                    )}
                    {record.status === 'Đã xác nhận' && (
                        <Button type="link" onClick={() => handleCompleteBooking(record.id)}>
                            Hoàn thành
                        </Button>
                    )}
                    <Button type="link" onClick={() => handleViewDetails(record)}>
                        Xem chi tiết
                    </Button>
                </Space>
            ),
        },
    ];

    const expandedRowRender = (record: Booking) => {
        return (
            <Card title="Thông tin khách hàng" size="small">
                <Space direction="vertical">
                    <Text><i className="ri-user-line" style={{ marginRight: 8 }}></i>Khách hàng: {record.customerInfo.name}</Text>
                    <Text><i className="ri-phone-line" style={{ marginRight: 8 }}></i>SĐT: {record.customerInfo.phone}</Text>
                    <Text><i className="ri-map-pin-line" style={{ marginRight: 8 }}></i>Địa chỉ: {record.customerInfo.address}</Text>
                </Space>
            </Card>
        );
    };

    const tabItems: TabsProps['items'] = [
        { key: 'all', label: 'Tất cả' },
        { key: 'pending', label: 'Chờ xác nhận' },
        { key: 'confirmed', label: 'Đã xác nhận' },
        { key: 'completed', label: 'Hoàn thành' },
        { key: 'cancelled', label: 'Đã hủy' },
    ];

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        // TODO: Fetch bookings based on the selected tab key
    };

    // Load dummy data on component mount
    useState(() => {
        setBookings(dummyBookings);
    });

    // Add a back button or similar if you navigate to detail view
    if (showDetail && selectedBooking) {
        return <BookingDetailScreen booking={selectedBooking} />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Quản Lý Đặt Lịch</Title>
            <Card style={{ marginTop: 20, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                    <Text strong>Danh Sách Đặt Lịch</Text>
                    <Space>
                        <RangePicker />
                    </Space>
                </Flex>
                <Tabs activeKey={activeTab} items={tabItems} onChange={handleTabChange} />
                <Table
                    columns={columns}
                    dataSource={bookings}
                    rowKey="id"
                    expandable={{ expandedRowRender }}
                    pagination={false}
                    scroll={{ x: 1500 }}
                />
            </Card>
        </div>
    );
};

export default BookingManagementScreen; 