import { Typography, Tabs, Table, DatePicker, Input, Button, Space, Flex, Card, Tag, Modal, Form, Spin, Grid, Dropdown, Menu } from 'antd';
import { useEffect, useState } from 'react';
import type { TabsProps, TableProps } from 'antd';
import dayjs from 'dayjs';
import { fetchBookings, IBookingItem, IBookingResponse, updateBookingStatus } from '../../services/booking.service';
import { DownOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

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
    const [isLoading, setIsLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const queryClient = useQueryClient();

    const fetchData = async () => {
        setIsLoading(true);
        try {
            let statusParam: number | undefined = undefined;
            if (activeTab === 'pending') statusParam = 1;
            else if (activeTab === 'confirmed') statusParam = 2;
            else if (activeTab === 'completed') statusParam = 3;
            else if (activeTab === 'cancelled') statusParam = 4;
            const res = await fetchBookings(1, 10, statusParam);
            setBookings(res.items);
            setTotalCount(res.totalItemsCount);
        } catch (e) {
            setBookings([]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    useEffect(() => {
        document.title = 'Quản lý Đặt lịch';
    }, []);

    const handleUpdateBookingStatus = async (id: string, status: number) => {
        try {
            await updateBookingStatus(id, status);
            message.success('Cập nhật trạng thái thành công');
            // Refetch lại danh sách
            fetchData();
        } catch (e) {
            message.error('Cập nhật trạng thái thất bại');
        }
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
                                <div key={s.id} style={{ marginTop: 2, marginBottom: 2, display: 'inline-block', fontSize: 13 }}>
                                    {s.serviceDetailName} - {s.serviceName}
                                </div>
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
            render: (bookingTime: string) => {
                if (!bookingTime) return '';
                const [d, t] = bookingTime.split('T');
                const [year, month, day] = d.split('-');
                const match = t.match(/(\d{2}:\d{2})/);
                const time = match ? match[1] : '';
                return <span>{`${day}/${month}/${year} ${time}`}</span>;
            },
        },
        {
            title: 'Tổng tiền (VNĐ)',
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
                        {record.status === 1 && (
                            <>
                                <Menu.Item key="start" onClick={() => handleUpdateBookingStatus(record.bookingId, 2)}>
                                    Tiến hành dịch vụ
                                </Menu.Item>
                                <Menu.Item key="cancel" onClick={() => handleUpdateBookingStatus(record.bookingId, 4)}>
                                    Hủy
                                </Menu.Item>
                            </>
                        )}
                        {record.status === 2 && (
                            <Menu.Item key="done" onClick={() => handleUpdateBookingStatus(record.bookingId, 3)}>
                                Xác nhận hoàn thành
                            </Menu.Item>
                        )}
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
    };

    const filteredData = bookings; // Đã filter bằng API nên không cần filter ở client nữa

    return (
        <div style={{ padding: screens.md ? '24px' : '12px' }}>
            <Title level={2}>Quản lý Đặt lịch</Title>
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