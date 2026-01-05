import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaShoppingCart, FaMoneyBillWave, FaTrash } from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalRevenue: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get("/admin/stats");
        setStats(statsRes.data);

        const usersRes = await api.get("/admin/users");
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 403 || error.response?.status === 401) {
             navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
      // Optionally update stats
      setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4 text-blue-600 text-2xl">
                <FaUsers />
            </div>
            <div>
                <p className="text-gray-500">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="p-3 bg-green-100 rounded-full mr-4 text-green-600 text-2xl">
                <FaShoppingCart />
            </div>
             <div>
                <p className="text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
             <div className="p-3 bg-yellow-100 rounded-full mr-4 text-yellow-600 text-2xl">
                <FaMoneyBillWave />
            </div>
             <div>
                <p className="text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
            </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">User Management</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6">Name</th>
                        <th className="py-3 px-6">Email</th>
                        <th className="py-3 px-6">College</th>
                        <th className="py-3 px-6 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {users.map(user => (
                        <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                             <td className="py-3 px-6 whitespace-nowrap">
                                <span className="font-medium">{user.name}</span>
                             </td>
                             <td className="py-3 px-6">{user.email}</td>
                             <td className="py-3 px-6">{user.collegeName}</td>
                             <td className="py-3 px-6 text-center">
                                <button 
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="text-red-500 hover:text-red-700 transition"
                                >
                                    <FaTrash />
                                </button>
                             </td>
                        </tr>
                    ))}
                </tbody>
            </table>
             {users.length === 0 && <p className="p-6 text-center text-gray-500">No users found.</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
