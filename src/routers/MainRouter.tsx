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
import CalendarScreen from "../screens/calendar/CalendarScreen.tsx";
import OrderManagementScreen from "../screens/orders/OrderManagementScreen.tsx";
import BookingManagementScreen from "../screens/bookings/BookingManagementScreen.tsx";
import BookingDetailScreen from "../screens/bookings/BookingDetailScreen.tsx";

const { Content, Footer } = Layout;
const MainRouter = () => {
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
              <Route path="/" element={<StoresScreen />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>

              {/* Service route */}
              <Route>
                <Route path="/services" element={<ServicesScreen />} />
                <Route
                  path="/services/:serviceId"
                  element={<ServiceDetailScreen />}
                />
                <Route
                  path="/services/add-service"
                  element={<AddServiceScreen />}
                />
              </Route>

              {/* Product route */}
              <Route>
                <Route path="/products" element={<ProductsScreen />} />
                <Route
                  path="/products/add-product"
                  element={<AddProductScreen />}
                />
                <Route path="/products/:id" element={<ProductDetailScreen />} />
              </Route>

              {/* Store route */}
              <Route>
                <Route path="/stores" element={<StoresScreen />} />
                <Route path="/stores/add-store" element={<AddStoreScreen />} />
                <Route path="/stores/:id" element={<StoreDetailScreen />} />
              </Route>

              {/* Calendar route */}
              <Route>
                <Route path="/calendar" element={<CalendarScreen />} />
              </Route>

              {/* Order Management route */}
              <Route>
                <Route path="/orders" element={<OrderManagementScreen />} />
              </Route>

              {/* Booking Management route */}
              <Route path="/bookings" element={<BookingManagementScreen />} />
              <Route
                path="/bookings/:id"
                element={
                  // @ts-expect-error: BookingDetailScreen requires 'booking' prop, needs to be provided via loader or wrapper
                  <BookingDetailScreen />
                }
              />

              {/* Add more route here */}
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
