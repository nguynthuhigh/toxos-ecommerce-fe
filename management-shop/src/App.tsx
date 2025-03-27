import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import MainLayout from "./components/layout/main-layout";
import CreateProduct from "./pages/product/create-product";
import Products from "./pages/product/products";
import Orders from "./pages/order/orders";
import Login from "./pages/auth/login";
import OrderDetail from "./pages/order/order-detail";
import Statistics from "./pages/order/statistics";
import RegisterShop from "./pages/auth/register-shop";
// import Discounts from "./pages/discount/discounts";
// import Reviews from "./pages/review/reviews";
// import Revenue from "./pages/finance/revenue";
// import Balance from "./pages/finance/balance";
// import Statistics from "./pages/report/statistics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login></Login>} />
          <Route
            path="/register-shop"
            element={<RegisterShop></RegisterShop>}
          />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/products" replace />} />
            <Route path="products">
              <Route index element={<Products />} />
              <Route path="create" element={<CreateProduct />} />
            </Route>
            <Route path="orders" element={<Orders />} />
            <Route path="order/:id" element={<OrderDetail />} />
            <Route path="statistics" element={<Statistics />} />

            {/* <Route path="discounts" element={<Discounts />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="balance" element={<Balance />} />
            <Route path="statistics" element={<Statistics />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
