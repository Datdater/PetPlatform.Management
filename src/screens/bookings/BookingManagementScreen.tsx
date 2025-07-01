import { Typography, Tabs, Table, DatePicker, Input, Button, Space, Flex, Card, Tag, Modal, Form, Spin, Grid, Dropdown, Menu } from 'antd';
import { useEffect, useState } from 'react';
import type { TabsProps, TableProps } from 'antd';
import dayjs from 'dayjs';
import BookingDetailScreen from './BookingDetailScreen';
import { fetchBookings, IBookingItem, IBookingResponse } from '../../services/booking.service';
import { DownOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

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
    const screens = useBreakpoint();
    const [activeTab, setActiveTab] = useState('all');
    const [bookings, setBookings] = useState<IBookingItem[]>([]);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<IBookingItem | null>(null);
    const [form] = Form.useForm();
    const [showDetail, setShowDetail] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetchBookings('3fa85f64-5717-4562-b3fc-2c963f66afa6', 1, 10);
                setBookings(res.items);
                setTotalCount(res.totalItemsCount);
            } catch (e) {
                setBookings([]);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const handleViewDetails = (booking: IBookingItem) => {
        setSelectedBooking(booking);
        setShowDetail(true);
    };

    const baseColumns: TableProps<IBookingItem>['columns'] = [
        {
            title: 'Mã đặt lịch',
            dataIndex: 'bookingId',
            key: 'bookingId',
            width: 100,
            fixed: screens.md ? 'left' : undefined,
        },
        {
            title: 'Thú cưng & Dịch vụ',
            dataIndex: 'petWithServices',
            key: 'petWithServices',
            width: 250,
            render: (petWithServices: IBookingItem['petWithServices']) => (
                <div>
                    {petWithServices.map((pws, idx) => (
                        <div key={idx} style={{ marginBottom: 4 }}>
                            <b>{pws.pet.name}</b> ({pws.pet.petType ? 'Chó' : 'Mèo'} - {pws.pet.color})<br />
                            {pws.services.map(s => (
                                <Tag key={s.id} style={{ marginTop: 2, marginBottom: 2 }}>{s.serviceDetailName}</Tag>
                            ))}
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Thời gian',
            dataIndex: 'bookingTime',
            key: 'bookingTime',
            width: 150,
            responsive: ['sm'],
            render: (bookingTime: string) => (
                <span>{new Date(bookingTime).toLocaleString('vi-VN')}</span>
            ),
        },
        {
            title: 'Tổng tiền (VND)',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            width: 120,
            responsive: ['md'],
            align: 'right',
            render: (totalPrice: number) => (
                <span>{totalPrice.toLocaleString('vi-VN')}</span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: number) => {
                let color = 'geekblue';
                let text = 'Khác';
                if (status === 1) { color = 'volcano'; text = 'Đã đặt'; }
                else if (status === 2) { color = 'blue'; text = 'Đang thực hiện'; }
                else if (status === 3) { color = 'green'; text = 'Hoàn thành'; }
                else if (status === 4) { color = 'red'; text = 'Đã hủy'; }
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 100,
            fixed: screens.md ? 'right' : undefined,
            align: 'center',
            render: (_: any, record: IBookingItem) => {
                const menu = (
                    <Menu>
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

    const columns = baseColumns.filter(col => !col.responsive || screens[col.responsive[0]]);

    const expandedRowRender = (record: IBookingItem) => {
        return (
            <Card title="Thông tin khách hàng" size="small">
                <Space direction="vertical">
                    <Text><i className="ri-user-line" style={{ marginRight: 8 }}></i>Khách hàng: {record.userName}</Text>
                    <Text><i className="ri-phone-line" style={{ marginRight: 8 }}></i>SĐT: {record.userPhone}</Text>
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

    const filteredData = bookings.filter(booking => {
        if (activeTab === 'all') return true;
        // ... (filtering logic)
    });

    if (showDetail && selectedBooking) {
        const bookingDetailProps = {
            id: selectedBooking.bookingId,
            customerInfo: {
                name: selectedBooking.userName,
                phone: selectedBooking.userPhone,
                address: (selectedBooking as any).userAddress || '',
            },
            service: {
                name: selectedBooking.petWithServices?.[0]?.services?.[0]?.serviceDetailName || '',
                price: selectedBooking.totalPrice,
                duration: '',
                image: '',
            },
            petInfo: {
                name: selectedBooking.petWithServices?.[0]?.pet?.name || '',
                type: String(selectedBooking.petWithServices?.[0]?.pet?.petType || ''),
                breed: (selectedBooking.petWithServices?.[0]?.pet as any)?.breed || '',
                age: (selectedBooking.petWithServices?.[0]?.pet as any)?.age || 0,
            },
            totalAmount: selectedBooking.totalPrice,
            status: String(selectedBooking.status),
            bookingDate: selectedBooking.bookingTime,
            bookingTime: selectedBooking.bookingTime,
            paymentMethod: (selectedBooking as any).paymentMethod || '',
            note: (selectedBooking as any).note || '',
        };
        return <BookingDetailScreen booking={bookingDetailProps} />;
    }

    return (
        <div style={{ padding: screens.md ? '24px' : '12px' }}>
            <Title level={2}>Quản lý đặt lịch</Title>
            <Card style={{ marginBottom: 24 }}>
                <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
                    <Space wrap>
                        <RangePicker />
                        <Input.Search placeholder="Tìm kiếm" style={{ width: 200 }} />
                    </Space>
                    <Text>Tổng cộng: {totalCount} đặt lịch</Text>
                </Flex>
            </Card>

            <Tabs defaultActiveKey="all" items={tabItems} onChange={handleTabChange} />

            <Spin spinning={isLoading}>
                <Table
                    columns={columns}
                    dataSource={bookings}
                    rowKey="bookingId"
                    scroll={{ x: 'max-content' }}
                    expandable={{ expandedRowRender }}
                    pagination={{ pageSize: 10 }}
                />
            </Spin>
        </div>
    );
};

export default BookingManagementScreen; 