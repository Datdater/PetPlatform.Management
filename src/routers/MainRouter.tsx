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
import { useParams } from "react-router-dom";

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

              {/* Service route */}
              <Route path="/services" element={<ServicesScreen />} />
              <Route path="/services/:serviceId" element={<ServiceDetailScreen />} />
              <Route path="/services/add-service" element={<AddServiceScreen />} />

              {/* Product route */}
              <Route path="/products" element={<ProductsScreen />} />
              <Route path="/products/add-product" element={<AddProductScreen />} />
              <Route path="/products/:id" element={<ProductDetailScreen />} />

              {/* Store route */}
              <Route path="/stores" element={<StoresScreen />} />
              <Route path="/stores/add-store" element={<AddStoreScreen />} />
              <Route path="/stores/:id" element={<StoreDetailScreen />} />

              {/* Calendar route */}
              <Route path="/calendar" element={<CalendarScreen />} />

              {/* Order Management route */}
              <Route path="/orders" element={<OrderManagementScreen />} />

              {/* Booking Management route */}
              <Route path="/bookings" element={<BookingManagementScreen />} />
              <Route path="/bookings/:id" element={<BookingDetailRouteWrapper />} />

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

function BookingDetailRouteWrapper() {
  const { id } = useParams();
  // Lấy danh sách bookings từ localStorage (hoặc có thể fetch từ API nếu cần)
  const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
  const selectedBooking = bookings.find((b: any) => b.bookingId === id);

  if (!selectedBooking) return <NotFound />;

  // Mapping sang đúng props như trong BookingManagementScreen
  const bookingDetailProps = {
    id: selectedBooking.bookingId,
    customerInfo: {
      name: selectedBooking.userName,
      phone: selectedBooking.userPhone,
      address: selectedBooking.userAddress || "",
    },
    service: {
      name: selectedBooking.petWithServices?.[0]?.services?.[0]?.serviceDetailName || "",
      price: selectedBooking.totalPrice,
      duration: "",
      image: "",
    },
    petInfo: {
      name: selectedBooking.petWithServices?.[0]?.pet?.name || "",
      type: String(selectedBooking.petWithServices?.[0]?.pet?.petType || ""),
      breed: (selectedBooking.petWithServices?.[0]?.pet as any)?.breed || "",
      age: (selectedBooking.petWithServices?.[0]?.pet as any)?.age || 0,
    },
    totalAmount: selectedBooking.totalPrice,
    status: String(selectedBooking.status),
    bookingDate: selectedBooking.bookingTime,
    bookingTime: selectedBooking.bookingTime,
    paymentMethod: selectedBooking.paymentMethod || "",
    note: selectedBooking.note || "",
  };

  return <BookingDetailScreen booking={bookingDetailProps} />;
}

export default MainRouter;
