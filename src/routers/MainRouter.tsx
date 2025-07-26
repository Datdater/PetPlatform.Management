import { Affix, Layout } from "antd";
import { BrowserRouter, Route, Routes } from "react-router";
import SiderComponent from "../components/common/SiderComponent";
import HeaderComponent from "../components/common/HeaderComponent";
import NotFound from "../screens/NotFound";
import StoresScreen from "../screens/stores/StoresScreen";
import AddStoreScreen from "../screens/stores/AddStoreScreen";
import StoreDetailScreen from "../screens/stores/StoreDetailScreen";
import ServicesScreen from "../screens/services/ServicesScreen.tsx";
import ServiceDetailScreen from "../screens/services/ServiceDetailScreen.tsx";
import AddServiceScreen from "../screens/services/AddServiceScreen.tsx";
import ProductsScreen from "../screens/product/ProductsScreen.tsx";
import AddProductScreen from "../screens/product/AddProductScreen.tsx";
import ProductDetailScreen from "../screens/product/ProductDetailScreen.tsx";
import Profile from "../screens/auth/Profile.tsx";
import OrderManagementScreen from "../screens/orders/OrderManagementScreen.tsx";
import BookingManagementScreen from "../screens/bookings/BookingManagementScreen.tsx";
import { useParams } from "react-router-dom";
import EditProductScreen from '../screens/product/EditProductScreen';
import AdminDashboard from "../screens/admin/AdminDashboard";
import { useAuthStore } from "../stores/authStore";
import UsersManagementScreen from "../screens/users/UsersManagementScreen.tsx";
import StoresManagementScreen from "../screens/stores/StoresManagementScreen.tsx";
import TransactionsScreen from "../screens/TransactionsScreen";
import OrdersScreen from "../screens/OrdersScreen";
import BookingsScreen from "../screens/BookingsScreen";

const { Content, Footer } = Layout;
const MainRouter = () => {
  const { user } = useAuthStore();
  return (
    <BrowserRouter>
      <Layout>
        <Affix offsetTop={0}>
          <SiderComponent />
        </Affix>
        <Layout
          style={{
            backgroundColor: "white !important",
          }}
        >
          <Affix offsetTop={0}>
            <HeaderComponent />
          </Affix>
          <Content className="pt-3 container-fluid">
            <Routes>
              <Route path="/" element={user?.role === "Admin" ? <AdminDashboard /> : <StoresScreen />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/profile" element={<Profile />} />

              {/* Service route */}
              <Route path="/services" element={<ServicesScreen />} />
              <Route path="/services/:serviceId" element={<ServiceDetailScreen />} />
              <Route path="/services/add-service" element={<AddServiceScreen />} />

              {/* Product route */}
              <Route path="/products" element={<ProductsScreen />} />
              <Route path="/products/add-product" element={<AddProductScreen />} />
              <Route path="/products/:id" element={<ProductDetailScreen />} />
              <Route path="/products/:id/edit" element={<EditProductScreen />} />

              {/* Store route */}
              <Route path="/stores" element={<StoresScreen />} />
              <Route path="/stores/add-store" element={<AddStoreScreen />} />
              <Route path="/stores/:id" element={<StoreDetailScreen />} />

              {/* Order Management route */}
              <Route path="/orders" element={<OrderManagementScreen />} />

              {/* Booking Management route */}
              <Route path="/bookings" element={<BookingManagementScreen />} />
              
              {/* Booking Management route */}
              <Route path="/list-users" element={<UsersManagementScreen />} />
              
              {/* Booking Management route */}
              <Route path="/list-stores" element={<StoresManagementScreen />} />

              {/* Transaction Management route */}
              <Route path="/transactions" element={<TransactionsScreen />} />

              {/* Admin Orders route */}
              <Route path="/ad-orders" element={<OrdersScreen />} />

              {/* Admin Bookings route */}
              <Route path="/ad-bookings" element={<BookingsScreen />} />

              {/* Add more route here */}
            </Routes>
          </Content>
          <Footer className="text-center">
            Sen&Pet Platform ©{new Date().getFullYear()} Created by Sen&Pet Platform
          </Footer>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default MainRouter;
