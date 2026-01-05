import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";

import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Items from "./pages/Items.jsx";
import Favorite from "./pages/Favorite.jsx";
import UserAccount from "./pages/UserAccount.jsx";
import ItemDetail from "./pages/ItemDetail.jsx";
import SellItem from "./pages/SellItem.jsx";
import EditItem from "./pages/EditItem.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";

// ... imports
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
       {/* ... existing Routes ... */}
       <Navbar />
       <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/items" element={<Items />} />
        <Route path="/favorite" element={<ProtectedRoute><Favorite /></ProtectedRoute>} />
        <Route path="/my-account" element={<ProtectedRoute><UserAccount /></ProtectedRoute>} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/items/create" element={<ProtectedRoute><SellItem /></ProtectedRoute>} />
        <Route path="/items/edit/:id" element={<ProtectedRoute><EditItem /></ProtectedRoute>} />
        <Route path="/order/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
      </Routes>
      </NotificationProvider>
    </ThemeProvider>
  );
}
// ... export

export default App;
