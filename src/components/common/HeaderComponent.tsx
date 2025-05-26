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
} from "antd";
import { Notification, SearchNormal1 } from "iconsax-react";
import { useNavigate } from "react-router";
import { colors } from "../../constants/colors";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";

const HeaderComponent = () => {
  const [visibleModalNotification, setVisibleModalNotification] =
    useState<boolean>(false);

  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: "Profile",
      onClick: () => {
        navigate("/profile");
      },
    },
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: async () => {
        await logout();
        navigate("/");
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
          <Button
            onClick={() => setVisibleModalNotification(true)}
            type="text"
            icon={
              <Badge count={4}>
                <Notification size={22} color={colors.gray600} />
              </Badge>
            }
          />
          <Dropdown menu={{ items }}>
            <Avatar
              src="https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg"
              alt="user avatar"
              size={40}
            />
          </Dropdown>
        </Space>
      </Col>

      <Drawer
        title="Notifications"
        open={visibleModalNotification}
        onClose={() => setVisibleModalNotification(false)}
      >
        <Typography>Noti</Typography>
      </Drawer>
    </Row>
  );
};

export default HeaderComponent;
