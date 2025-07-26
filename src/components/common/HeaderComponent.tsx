/** @format */

import {
  Avatar,
  Badge,
  Button,
  Col,
  Drawer,
  Dropdown,
  Input,
  MenuProps,
  Row,
  Space,
  Typography,
  Card,
} from "antd";
import { Notification, SearchNormal1 } from "iconsax-react";
import { useNavigate } from "react-router";
import { colors } from "../../constants/colors";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { BellOutlined, ShoppingCartOutlined, UserAddOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ShopOutlined } from '@ant-design/icons';

const HeaderComponent = () => {
  const [visibleModalNotification, setVisibleModalNotification] =
    useState<boolean>(false);

  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  // Fake notifications data
  const notifications = user?.role === 'Admin'
    ? [
        {
          id: 1,
          icon: <ShoppingCartOutlined style={{ color: '#52c41a', fontSize: 20 }} />,
          title: 'Đơn hàng mới đã thanh toán',
          description: 'Đơn hàng #DH001 đã được thanh toán thành công.',
          time: '2 phút trước',
          unread: true,
        },
        {
          id: 2,
          icon: <CheckCircleOutlined style={{ color: '#1890ff', fontSize: 20 }} />,
          title: 'Giao dịch hoàn tất',
          description: 'Giao dịch #GD002 đã hoàn thành.',
          time: '10 phút trước',
          unread: true,
        },
        {
          id: 3,
          icon: <UserAddOutlined style={{ color: '#faad14', fontSize: 20 }} />,
          title: 'Người dùng mới',
          description: '2 người dùng mới vừa đăng ký.',
          time: '30 phút trước',
          unread: false,
        },
        {
          id: 4,
          icon: <ExclamationCircleOutlined style={{ color: '#f5222d', fontSize: 20 }} />,
          title: 'Báo cáo hệ thống',
          description: 'Có 2 sản phẩm sắp hết hàng.',
          time: '1 giờ trước',
          unread: false,
        },
      ]
    : [
        {
          id: 1,
          icon: <ShoppingCartOutlined style={{ color: '#52c41a', fontSize: 20 }} />,
          title: 'Đơn hàng mới',
          description: 'Bạn vừa nhận được đơn hàng mới.',
          time: '5 phút trước',
          unread: true,
        },
        {
          id: 2,
          icon: <ShopOutlined style={{ color: '#1890ff', fontSize: 20 }} />,
          title: 'Dịch vụ được đặt',
          description: 'Khách hàng đã đặt dịch vụ Tắm cho chó.',
          time: '20 phút trước',
          unread: false,
        },
        {
          id: 3,
          icon: <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 20 }} />,
          title: 'Sản phẩm sắp hết hàng',
          description: 'Sản phẩm Thức ăn cho mèo còn 3 đơn vị.',
          time: '1 giờ trước',
          unread: true,
        },
      ];
  const unreadCount = notifications.filter(n => n.unread).length;

  const items: MenuProps["items"] = [
    // Chỉ hiển thị mục 'Thông tin cửa hàng' nếu user không phải là Admin
    ...(user?.role !== "Admin"
      ? [
          {
            key: "profile",
            label: "Thông tin cửa hàng",
            onClick: () => {
              navigate("/profile");
            },
          },
        ]
      : []),
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: async () => {
        await logout();
        navigate("/");
        window.location.reload();
      },
    },
  ];

  return (
    <Row style={{ padding: "10px 20px", backgroundColor: colors.white }}>
      <Col span={12} style={{ textAlign: "left" }}>
        <Input
          placeholder="Search product, supplier, order"
          style={{
            borderRadius: 100,
          }}
          size="large"
          prefix={<SearchNormal1 className="text-muted" size={20} />}
        />
      </Col>
      <Col span={12} style={{ textAlign: "right" }}>
        <Space>
          {user?.role !== "Admin" && (
            <Button
              onClick={() => setVisibleModalNotification(true)}
              type="text"
              icon={
                <Badge count={unreadCount}>
                  <BellOutlined style={{ fontSize: 22, color: colors.gray600 }} />
                </Badge>
              }
            />
          )}
         {user?.role === "Admin" && (
            <Button
              onClick={() => setVisibleModalNotification(true)}
              type="text"
              icon={
                <Badge count={unreadCount}>
                  <BellOutlined style={{ fontSize: 22, color: colors.gray600 }} />
                </Badge>
              }
            />
          )}
          <Dropdown menu={{ items }}>
            <Space>
            {user?.name && (
                <span style={{ fontWeight: 700 }}>{user.name}</span>
              )}
              <Avatar
                src={user?.storeLogo || "https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"}
                alt="user avatar"
                size={40}
              />
            </Space>
          </Dropdown>
        </Space>
      </Col>

      <Drawer
        title="Notifications"
        open={visibleModalNotification}
        onClose={() => setVisibleModalNotification(false)}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {notifications.length === 0 && <Typography.Text type="secondary">Không có thông báo nào</Typography.Text>}
          {notifications.map(n => (
            <Card key={n.id} size="small" style={{ background: n.unread ? '#f6ffed' : '#fff' }}>
              <Space align="start">
                {n.icon}
                <div>
                  <Typography.Text strong>{n.title}</Typography.Text>
                  <div style={{ color: '#888', fontSize: 13 }}>{n.description}</div>
                  <div style={{ color: '#aaa', fontSize: 12 }}>{n.time}</div>
                </div>
              </Space>
            </Card>
          ))}
        </Space>
      </Drawer>
    </Row>
  );
};

export default HeaderComponent;
