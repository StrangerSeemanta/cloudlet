import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./pages/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import MessagingPage from "./pages/MessagePage";
import ProductsPage from "./pages/ProductPage";
import AddProductPage from "./pages/AddProductPage";
import SalePage from "./pages/SalePage";
import LoginPage from "./pages/LoginPage";
import CreateAccountPage, { CreateUserForm } from "./pages/CreateAccountPage";
import { AuthContext } from "./context/authContext";
import Loading from "./components/myui/Loading";
import VerifyEmail from "./components/myui/VerifyEmail";
import NoPage from "./components/myui/NoPage";
import UploadProfilePage from "./components/myui/UploadProfilePage";
import StockPage from "./pages/StockPage";
import DailyExpense from "./pages/DailyExpense";
import SellProductPage from "./pages/SellProductPage";
import DynamicsSaleDetails from "./pages/DynamicsSaleDetails";
import FinancialActivityPage from "./pages/FinancialActivity";
const AuthenticatedRoutes = (
  <Route path="/" element={<DashboardLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="finance" element={<FinancialActivityPage />} />

    <Route path="stock" element={<StockPage />} />
    <Route path="sell" element={<SellProductPage />} />

    <Route path="sales" element={<SalePage />} />
    <Route
      path="sales/details/:soldProductId"
      element={<DynamicsSaleDetails />}
    />

    <Route path="products" element={<ProductsPage />} />
    <Route path="products/add" element={<AddProductPage />} />
    <Route path="expense" element={<DailyExpense />} />
  </Route>
);

const AppRouter: React.FC = () => {
  const { user, loadingUser } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {loadingUser ? (
          <Route
            path="/"
            element={
              <div className="h-screen w-full">
                <Loading />
              </div>
            }
          />
        ) : user ? (
          AuthenticatedRoutes
        ) : (
          <Route path="/" element={<LandingPage />} />
        )}

        {user && <Route path="/chat" element={<MessagingPage />} />}
        <Route path="/account/login" element={<LoginPage />} />
        <Route path="/account/create" element={<CreateAccountPage />}>
          <Route index element={<CreateUserForm />} />
          <Route path="verify_email" element={<VerifyEmail />} />
          <Route path="upload_pp" element={<UploadProfilePage />} />
        </Route>

        <Route path="*" element={<NoPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
