import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Trash2, Search, ExternalLink } from 'lucide-react';

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [page]);

  const fetchItems = async () => {
    try {
      const response = await api.get(`/admin/items?page=${page}&limit=10`);
      if (response.data.success) {
        setItems(response.data.data);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError("Failed to load items: " + response.data.message);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setError(error.response?.data?.message || error.message || "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/admin/items/${id}`);
        fetchItems(); // Refresh list
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Items Management</h2>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading items...</div>
        ) : error ? (
           <div className="p-8 text-center text-red-500 bg-red-50 m-4 rounded-lg">
             <p className="font-medium">Error Occurred</p>
             <p className="text-sm">{error}</p>
             <button 
                onClick={() => { setError(null); setLoading(true); fetchItems(); }}
                className="mt-2 text-blue-600 hover:underline text-sm"
             >
                Retry
             </button>
           </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-2">
            <p>No items found.</p>
            <p className="text-sm">Items added by sellers will appear here.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Seller</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <img 
                          src={item.images?.[0] || 'https://via.placeholder.com/50'} 
                          alt={item.title} 
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      </td>
                      <td className="p-4 font-medium text-gray-900">{item.title}</td>
                      <td className="p-4 text-gray-600">₹{item.price}</td>
                      <td className="p-4 text-gray-600">
                        <div className="text-sm">{item.seller?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-400">{item.seller?.email}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.isSold ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                        }`}>
                          {item.isSold ? 'Sold' : 'Available'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 size={18} />
                        </button>
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

export default Items;
