import { Typography, Card, Space, Flex, Table, Tag, Divider } from 'antd';
import { UserOutlined, PhoneOutlined, EnvironmentOutlined, ClockCircleOutlined, SolutionOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface BookingDetailProps {
    booking: {
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
    };
}

const BookingDetailScreen: React.FC<BookingDetailProps> = ({ booking }) => {
    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Chi Tiết Đặt Lịch #{booking.id}</Title>

            {/* Status Section */}
            <Card style={{ marginBottom: 20, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                <Space direction="vertical" size="small">
                    <Flex align="center">
                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                        <Text strong>Trạng thái:</Text>
                        <Tag color={booking.status === 'Hoàn thành' ? 'green' : 'geekblue'}>{booking.status.toUpperCase()}</Tag>
                    </Flex>
                    {booking.status === 'Hoàn thành' && <Text type="secondary">Đã hoàn thành dịch vụ</Text>}
                </Space>
            </Card>

            {/* Booking Info Section */}
            <Card title="Thông tin đặt lịch" style={{ marginBottom: 20, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                <Space direction="vertical" size="middle">
                    <Flex align="center">
                        <SolutionOutlined style={{ marginRight: 8 }} />
                        <Text strong>Mã đặt lịch:</Text>
                        <Text>{booking.id}</Text>
                    </Flex>
                    <Space direction="vertical" size="small">
                        <Flex align="center">
                            <EnvironmentOutlined style={{ marginRight: 8 }} />
                            <Text strong>Địa chỉ:</Text>
                        </Flex>
                        <Text>{booking.customerInfo.address}</Text>
                    </Space>
                    <Flex align="center">
                        <UserOutlined style={{ marginRight: 8 }} />
                        <Text strong>Khách hàng:</Text>
                        <Text>{booking.customerInfo.name}</Text>
                    </Flex>
                    <Flex align="center">
                        <PhoneOutlined style={{ marginRight: 8 }} />
                        <Text strong>SĐT:</Text>
                        <Text>{booking.customerInfo.phone}</Text>
                    </Flex>
                    {booking.note && (
                        <Space direction="vertical" size="small">
                            <Text strong>Ghi chú:</Text>
                            <Text>{booking.note}</Text>
                        </Space>
                    )}
                </Space>
            </Card>

            {/* Service Info Section */}
            <Card title="Thông tin dịch vụ" style={{ marginBottom: 20, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                <Space direction="vertical" size="middle">
                    <Flex align="center">
                        <img src={booking.service.image} alt={booking.service.name} style={{ width: 100, marginRight: 16 }} />
                        <Space direction="vertical">
                            <Text strong>{booking.service.name}</Text>
                            <Text type="secondary">Thời gian: {booking.service.duration}</Text>
                            <Text type="secondary">Ngày hẹn: {booking.bookingDate}</Text>
                            <Text type="secondary">Giờ hẹn: {booking.bookingTime}</Text>
                        </Space>
                    </Flex>
                </Space>
            </Card>

            {/* Pet Info Section */}
            <Card title="Thông tin thú cưng" style={{ marginBottom: 20, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                <Space direction="vertical" size="middle">
                    <Flex align="center">
                        <Text strong>Tên thú cưng:</Text>
                        <Text style={{ marginLeft: 8 }}>{booking.petInfo.name}</Text>
                    </Flex>
                    <Flex align="center">
                        <Text strong>Loại:</Text>
                        <Text style={{ marginLeft: 8 }}>{booking.petInfo.type}</Text>
                    </Flex>
                    <Flex align="center">
                        <Text strong>Giống:</Text>
                        <Text style={{ marginLeft: 8 }}>{booking.petInfo.breed}</Text>
                    </Flex>
                    <Flex align="center">
                        <Text strong>Tuổi:</Text>
                        <Text style={{ marginLeft: 8 }}>{booking.petInfo.age} tuổi</Text>
                    </Flex>
                </Space>
            </Card>

            {/* Payment Info Section */}
            <Card title="Thông tin thanh toán" style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                <Space direction="vertical" size="middle">
                    <Flex justify="space-between" align="center">
                        <Text strong>Phí dịch vụ:</Text>
                        <Text>{booking.service.price.toLocaleString('vi-VN')}VND</Text>
                    </Flex>
                    <Divider style={{ margin: '8px 0' }} />
                    <Flex justify="space-between" align="center">
                        <Text strong>Tổng tiền:</Text>
                        <Text strong>{booking.totalAmount.toLocaleString('vi-VN')}VND</Text>
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Text strong>Hình thức thanh toán:</Text>
                        <Text>{booking.paymentMethod}</Text>
                    </Flex>
                </Space>
            </Card>
        </div>
    );
};

export default BookingDetailScreen; 