
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Homepage";
// import Dashboard from "../pages/Dashboard";
// import NotFound from "../pages/NotFound";
import PrivateRoute from "../components/PrivateRoute";
import AuthForm from "../components/Auth";
import { AuthProvider } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
import Auth from "../pages/Auth";
import { ToastContainer } from "react-toastify";
import AdminLayout from "../layouts/AdminLayout";
import Product from "../pages/Product";
import Order from "../pages/Orders";
import AddProduct from "../pages/ProductForm";
import ProductList from "../pages/ProductList";
import ProductPage from "../pages/client/ProductPage";
import ClientLayout from "../layouts/ClientLayout";
import ProductDetailPage from "../pages/client/ProductDetailPage";
import CartPage from "../pages/client/CartPage";


const AppRoutes = () => {
    return (
        <>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          {/* <Route path="/san-pham" element={<ProductPage />} /> */}

          <Route
          path="/"
          element={
            // <PrivateRoute>
              <ClientLayout />
            // </PrivateRoute>
          }
        >
       <Route path="/san-pham" element={<ProductPage />} />
       <Route path="/gio-hang" element={<CartPage />} />
       <Route path="/product/detail/:product_id" element={<ProductDetailPage />} />
        </Route>




          {/* Protected Routes - Only accessible when authenticated */}
          <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path="products/list" element={<ProductList />} />

          <Route path="products" element={<Product />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="orders" element={<Order />} />
        </Route>
          {/* <Route
            element={
              <AuthProvider>
                <PrivateRoute />
              </AuthProvider>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
          </Route> */}

          
          <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        </Routes>
        </>
     
    );
  };
  
  export default AppRoutes;