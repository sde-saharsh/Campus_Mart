import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import Users from "./pages/Users";
import Items from "./pages/Items";
import Orders from "./pages/Orders";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
// import "./App.css";

function App() {
  const isAuthenticated = !!localStorage.getItem("token"); // Simple check, could be improved

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/" />}>
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/users" element={<Users />} />
          <Route path="/items" element={<Items />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
