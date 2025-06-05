import { Typography, Card, Space, Flex, Table, Tag, Divider } from 'antd';
import { UserOutlined, PhoneOutlined, EnvironmentOutlined, CarryOutOutlined, SolutionOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface OrderDetailProps {
    // In a real application, you would fetch order data based on an ID passed here
    // For now, we will use a dummy structure similar to the list item
    order: {
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
    };
}

const OrderDetailScreen: React.FC<OrderDetailProps> = ({ order }) => {

    // Placeholder columns for product list within payment info
    const productColumns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'name',
            key: 'name',
             render: (text: string, record: any) => (
                <Flex align="center">
                     {/* Assuming product has an image field */}
                     {/* <img src={record.image} alt={text} style={{ width: 40, marginRight: 10 }} /> */}
                     <Text>{text}</Text>
                </Flex>
            ),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
             render: (price: number) => <Text>{price.toLocaleString('vi-VN')}VND</Text>
        },
         {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Tổng cộng',
            key: 'total',
             render: (_: any, record: any) => <Text>{(record.quantity * record.price).toLocaleString('vi-VN')}VND</Text>
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Chi Tiết Đơn Hàng #{order.id}</Title>

            {/* Status Section */}
            <Card style={{ marginBottom: 20, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                 <Space direction="vertical" size="small">
                     <Flex align="center">
                         <CarryOutOutlined style={{ marginRight: 8 }} />
                          <Text strong>Trạng thái:</Text>
                          <Tag color={order.status === 'Đã giao' ? 'green' : 'geekblue'}>{order.status.toUpperCase()}</Tag>
                     </Flex>
                      {order.status === 'Đã giao' && <Text type="secondary">Đã giao thành công</Text>}
                      {/* Add other status messages here */}
                 </Space>
            </Card>

            {/* Order Info Section */}
            <Card title="Thông tin đơn hàng" style={{ marginBottom: 20, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                 <Space direction="vertical" size="middle">
                     <Flex align="center">
                         <SolutionOutlined style={{ marginRight: 8 }} />
                         <Text strong>Mã đơn hàng:</Text>
                         <Text>{order.id}</Text>
                     </Flex>
                     <Space direction="vertical" size="small">
                         <Flex align="center">
                             <EnvironmentOutlined style={{ marginRight: 8 }} />
                             <Text strong>Địa chỉ nhận hàng:</Text>
                         </Flex>
                         <Text>{order.customerInfo.address}</Text>
                     </Space>
                      {/* Add customer name and phone if needed from expanded row data */}
                      <Flex align="center">
                         <UserOutlined style={{ marginRight: 8 }} />
                         <Text strong>Khách hàng:</Text>
                         <Text>{order.customerInfo.name}</Text>
                      </Flex>
                       <Flex align="center">
                         <PhoneOutlined style={{ marginRight: 8 }} />
                         <Text strong>SĐT:</Text>
                         <Text>{order.customerInfo.phone}</Text>
                      </Flex>
                      {order.note && (
                         <Space direction="vertical" size="small">
                             <Text strong>Ghi chú:</Text>
                              <Text>{order.note}</Text>
                         </Space>
                      )}
                 </Space>
            </Card>

            {/* Payment Info Section */}
             <Card title="Thông tin thanh toán" style={{ marginBottom: 20, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                 <Table
                     columns={productColumns}
                     dataSource={order.products}
                     pagination={false}
                     summary={() => (
                         <Table.Summary>
                             <Table.Summary.Row>
                                 <Table.Summary.Cell index={0} colSpan={3} align="right"><Text strong>Tổng tiền sản phẩm:</Text></Table.Summary.Cell>
                                 <Table.Summary.Cell index={3}>
                                      <Text strong>{order.totalAmount.toLocaleString('vi-VN')}VND</Text>
                                 </Table.Summary.Cell>
                             </Table.Summary.Row>
                         </Table.Summary>
                     )}
                 />
                 <Divider style={{ margin: '16px 0' }} />
                  <Flex justify="space-between" align="center">
                      <Text strong>Hình thức thanh toán:</Text>
                      <Text>{order.paymentMethod}</Text>
                  </Flex>
             </Card>

            {/* Order History Section (Placeholder) */}
             <Card title="Lịch sử đơn hàng" style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
                 <Space direction="vertical" size="small">
                      {/* Dummy history items based on image */}
                      <Flex align="center">
                          <Tag color="green">Đơn hàng hoàn thành</Tag>
                          <Text type="secondary">23:44 05/09/2025</Text>
                      </Flex>
                      <Flex align="center">
                           <Tag color="blue">Đơn hàng mới</Tag>
                           <Text type="secondary">23:44 02/09/2025</Text>
                      </Flex>
                      {/* Add more history items as needed */}
                 </Space>
             </Card>

        </div>
    );
};

export default OrderDetailScreen; 