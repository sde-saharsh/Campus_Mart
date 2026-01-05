import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Users, ShoppingCart, DollarSign, Package } from 'lucide-react';

const Overview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/reports'); // Interceptor likely handles token
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || 0} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Orders" 
          value={stats?.totalOrders || 0} 
          icon={ShoppingCart} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats?.totalRevenue || 0}`} 
          icon={DollarSign} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Active Items" 
          value={stats?.totalItems || 0} 
          icon={Package} 
          color="bg-orange-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* We can add recent activity or charts here later */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
           <div className="flex gap-4">
              <button className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                View All Orders
              </button>
              <button className="bg-purple-50 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors">
                Manage Users
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
