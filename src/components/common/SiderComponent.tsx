/** @format */

import { Flex, Layout, Menu, MenuProps, Image, Typography } from "antd";
import { Link, useNavigate } from "react-router";
import { appInfo } from "../../constants/appInfos";
import { colors } from "../../constants/colors";
import { AiFillContainer, AiFillProduct, AiFillShop } from "react-icons/ai";
import { AiOutlineTable, AiOutlineUser, AiOutlineTransaction, AiOutlineOrderedList, AiOutlineBook } from "react-icons/ai";
import { AiOutlineFileAdd } from "react-icons/ai";
import { AiOutlineCalendar } from "react-icons/ai";
import { useAuthStore } from "../../stores/authStore";

const { Sider } = Layout;
const { Text } = Typography;
type MenuItem = Required<MenuProps>["items"][number];

const SiderComponent = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  let items: MenuItem[];

  if (user?.role === "Admin") {
    items = [
      {
        key: "users",
        label: <Link to={"/list-users"}>Quản lý người dùng</Link>,
        icon: <AiOutlineUser size={20} />,
      },
      {
        key: "stores",
        label: <Link to={"/list-stores"}>Quản lý cửa hàng</Link>,
        icon: <AiFillShop size={20} />,
      },
      {
        key: "transactions",
        label: <Link to={"/transactions"}>Các giao dịch</Link>,
        icon: <AiOutlineTransaction size={20} />,
      },
      {
        key: "orders",
        label: <Link to={"/ad-orders"}>Danh sách Đơn hàng</Link>,
        icon: <AiOutlineOrderedList size={20} />,
      },
      {
        key: "bookings",
        label: <Link to={"/ad-bookings"}>Danh sách Đặt lịch</Link>,
        icon: <AiOutlineBook size={20} />,
      },
    ];
  } else {
    items = [
      {
        key: "products",
        label: "Quản lý Sản phẩm",
        icon: <AiFillProduct size={20} />,
        children: [
          {
            key: "products",
            label: <Link to={"/products"}>Tất cả</Link>,
            icon: <AiOutlineTable />,
          },
          {
            key: "addNewProduct",
            label: <Link to={`/products/add-product`}>Thêm mới</Link>,
            icon: <AiOutlineFileAdd />,
          },
        ],
      },
      {
        key: "services",
        label: "Quản lý Dịch vụ",
        icon: <AiFillContainer size={20} />,
        children: [
          {
            key: "stores",
            label: <Link to={"/services"}>Tất cả</Link>,
            icon: <AiOutlineTable />,
          },
          {
            key: "addNew",
            label: <Link to={`/services/add-service`}>Thêm mới</Link>,
            icon: <AiOutlineFileAdd />,
          },
        ],
      },
      {
        key: "orders",
        label: <Link to={"/orders"}>Quản lý Đơn hàng</Link>,
        icon: <AiOutlineTable size={20} />,
      },
      {
        key: "bookings",
        label: <Link to={"/bookings"}>Quản lý Đặt lịch</Link>,
        icon: <AiOutlineBook size={20} />,
      },
    ];
  }
  return (
    <Sider width={280} theme="light" style={{ height: "100vh" }}>
      <Flex style={{ padding: "20px 0", alignItems: "center", justifyContent: "center" }} align="middle" justify="center">
        <Image
          width={64}
          src={appInfo.logo}
          preview={false}
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        />
      </Flex>
      <Menu
        mode="inline"
        items={items}
        theme="light"
        style={{
          borderRight: 0,
        }}
      />
      <style>{`
        .ant-menu-light .ant-menu-item-selected,
        .ant-menu-light .ant-menu-item-active,
        .ant-menu-light .ant-menu-item:hover,
        .ant-menu-light .ant-menu-submenu-selected > .ant-menu-submenu-title,
        .ant-menu-light .ant-menu-submenu-active > .ant-menu-submenu-title,
        .ant-menu-light .ant-menu-submenu-title:hover {
          color: #5abab5 !important;
          background: #e6f7f6 !important;
        }
        .ant-menu-light .ant-menu-item .anticon,
        .ant-menu-light .ant-menu-submenu-title .anticon {
          color: #5abab5 !important;
        }
        .ant-menu-light .ant-menu-item-selected .anticon,
        .ant-menu-light .ant-menu-item-active .anticon,
        .ant-menu-light .ant-menu-item:hover .anticon {
          color: #5abab5 !important;
        }
        .ant-menu-light .ant-menu-item {
          border-radius: 8px;
        }
        .ant-menu-light .ant-menu-submenu-open .ant-menu-submenu-title {
          color: #5abab5 !important;
        }
        .ant-menu-light .ant-menu-submenu .ant-menu-item-selected {
          color: #5abab5 !important;
          background: #e6f7f6 !important;
        }
        .ant-menu-light .ant-menu-submenu .ant-menu-item-active {
          color: #5abab5 !important;
        }
        .ant-menu-light .ant-menu-submenu .ant-menu-item:hover {
          color: #5abab5 !important;
        }
      `}</style>
    </Sider>
  );
};

export default SiderComponent;
