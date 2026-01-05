import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const MyOrders = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get('/order/my');
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">My Orders</h2>
        <p>Please <Link to="/login" className="text-emerald-600">login</Link> to view your orders.</p>
      </div>
    );
  }

  if (loading) return <p className="p-6">Loading orders...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 min-h-screen bg-primary text-text-primary">
      <h1 className="text-2xl font-bold mb-6 text-text-primary">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-text-secondary">You have no orders yet.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((o) => {
            const item = o.item || o.itemId || {};
            return (
              <div key={o._id} className="border border-border-color bg-surface rounded-lg p-4 flex gap-4 items-center shadow-sm">
                <img src={item.images?.[0] || '/placeholder.png'} alt={item.title || 'item'} className="h-24 w-24 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold text-text-primary">{item.title || 'Item'}</h3>
                  <p className="text-sm text-text-secondary">Seller: {o.seller?.name || o.seller?.collegeName || 'N/A'}</p>
                  <p className="text-sm text-text-secondary">Ordered on: {new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold mb-1 text-text-primary">{o.status}</div>
                  <Link to={`/order/${o._id}`} className="text-sm text-emerald-600 font-bold hover:underline">View Details & Chat</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders