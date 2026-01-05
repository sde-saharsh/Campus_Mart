import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Search } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/admin/orders?page=${page}&limit=10`);
      setOrders(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Orders Management</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No orders found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Item</th>
                    <th className="p-4">Buyer</th>
                    <th className="p-4">Seller</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm text-gray-500 font-mono">{order._id.substring(order._id.length - 8)}</td>
                      <td className="p-4 font-medium text-gray-900">{order.item?.title || 'Unknown Item'}</td>
                      <td className="p-4 text-gray-600">
                        <div className="text-sm">{order.buyer?.name}</div>
                        <div className="text-xs text-gray-400">{order.buyer?.email}</div>
                      </td>
                      <td className="p-4 text-gray-600">
                        <div className="text-sm">{order.seller?.name}</div>
                        <div className="text-xs text-gray-400">{order.seller?.email}</div>
                      </td>
                      <td className="p-4 font-medium">₹{order.item?.price}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
                <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-gray-600">
                    Page {page} of {totalPages}
                </span>
                <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                >
                    Next
                </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
