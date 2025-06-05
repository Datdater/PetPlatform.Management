/** @format */

import { Flex, Layout, Menu, MenuProps, Image, Typography } from "antd";
import { Link } from "react-router";
import { appInfo } from "../../constants/appInfos";
import { colors } from "../../constants/colors";
import { AiFillContainer, AiFillProduct, AiFillShop } from "react-icons/ai";
import { AiOutlineTable } from "react-icons/ai";
import { AiOutlineFileAdd } from "react-icons/ai";
import { AiOutlineCalendar } from "react-icons/ai";
import { AiOutlineBook } from "react-icons/ai";

const { Sider } = Layout;
const { Text } = Typography;
type MenuItem = Required<MenuProps>["items"][number];

const SiderComponent = () => {
  const items: MenuItem[] = [
    {
      key: "stores",
      label: "Quản lý Cửa hàng",
      icon: <AiFillShop size={20} />,
      children: [
        {
          key: "stores",
          label: <Link to={"/stores"}>Tất cả</Link>,
          icon: <AiOutlineTable />,
        },
        {
          key: "addNew",
          label: <Link to={`/stores/add-store`}>Thêm mới</Link>,
          icon: <AiOutlineFileAdd />,
        },
      ],
    },
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
      key: "calendar",
      label: <Link to={"/calendar"}>Lịch</Link>,
      icon: <AiOutlineCalendar size={20} />,
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
  return (
    <Sider width={280} theme="light" style={{ height: "100vh" }}>
      <Flex style={{ padding: "20px" }} align="middle">
        <Image width={40} src={appInfo.logo} alt={appInfo.title} />
        <Text
          style={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            color: colors.primary500,
            margin: 0,
          }}
        >
          {appInfo.title}
        </Text>
      </Flex>
      <Menu mode="inline" items={items} theme="light" />
    </Sider>
  );
};

export default SiderComponent;
