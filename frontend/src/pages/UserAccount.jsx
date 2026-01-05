import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiShoppingBag, FiBox, FiLogOut, FiSettings, FiStar } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import LocationPicker from "../components/LocationPicker";

const UserAccount = () => {
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [myItems, setMyItems] = useState([]);
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch user items
        // In a real app we might have a specific endpoint for my-items, 
        // ensuring we filter by seller ID here if endpoint doesn't.
        // For now, let's assume /item/all returns all and we filter client side 
        // OR we implemented getMyItems backend endpoint. 
        // Let's use the /order/my endpoint for orders.
        
        const [ordersRes, itemsRes] = await Promise.all([
          api.get("/order/sold"), // Fetch SALES, not purchases
          api.get("/item/all")
        ]);

        if (ordersRes.data.success) {
            // /order/sold returns { data: [orders], count, ... } or just data depending on controller
            // Controller returns { data: orders } inside the main object?
            // Let's check controller: res.status(200).json({ success: true, ..., data: orders })
            setMyOrders(ordersRes.data.data);
        }
         if (itemsRes.data.success) {
            const userItems = itemsRes.data.data.filter(item => item.seller._id === user._id || item.seller === user._id);
            setMyItems(userItems);
         }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, user]);

  if (!user) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
        setFormData({
            name: user.name || "",
            mobileNo: user.mobileNo || "",
            collegeName: user.collegeName || "",
            branch: user.branch || "",
            yearOfStudy: user.yearOfStudy || "",
            image: user.image || "",
            location: user.location || { address: "", coordinates: { lat: 0, lng: 0 } }
        });
    }
  }, [user]);

  const handleUpdateProfile = async () => {
      try {
          const res = await api.put("/user/update", formData);
          if (res.data.success) {
              await refreshUser(); // Update global context
              setIsEditing(false);
              alert("Profile updated successfully!");
          }
      } catch (error) {
          console.error(error);
          alert(error.response?.data?.message || "Failed to update profile");
      }
  };

  const handleDeleteItem = async (itemId) => {
      if(!window.confirm("Are you sure you want to delete this item?")) return;
      try {
          const res = await api.delete(`/item/${itemId}`);
          if(res.data.success){
              setMyItems(prev => prev.filter(i => i._id !== itemId));
              alert("Item deleted successfully");
          }
      } catch (error) {
          console.error(error);
          alert("Failed to delete item");
      }
  }

  const handleUpdateOrderStatus = async (orderId, action) => {
      try {
          let res;
          if (action === 'confirm') res = await api.patch(`/order/${orderId}/confirm`);
          else if (action === 'cancel') res = await api.patch(`/order/${orderId}/cancel`);
          else if (action === 'complete') res = await api.patch(`/order/${orderId}/complete`);

          if (res && res.data.success) {
              alert(`Order ${action}ed successfully`);
              // Refresh orders
              const ordersRes = await api.get("/order/sold");
              if (ordersRes.data.success) setMyOrders(ordersRes.data.data);
          }
      } catch (error) {
          console.error(error);
          alert("Failed to update order status");
      }
  };

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`whitespace-nowrap flex-shrink-0 w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id
          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
    >
      <Icon size={20} />
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-primary py-4 md:py-10 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
        
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-border-color mb-6 flex flex-col items-center text-center relative group">
             <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 flex items-center justify-center text-3xl font-bold mb-3 overflow-hidden border-2 border-emerald-50 dark:border-gray-800">
                {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    user.name?.charAt(0)
                )}
             </div>
             
             {activeTab === "profile" && isEditing && (
                <label className="absolute top-16 -right-1 bg-emerald-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-emerald-700 transition transform hover:scale-110">
                    <FiSettings size={14} />
                    <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if(!file) return;
                            
                            const formData = new FormData();
                            formData.append('images', file);
                            
                            try {
                                alert("Uploading image...");
                                const res = await api.post("/upload", formData, {
                                    headers: { 'Content-Type': 'multipart/form-data' }
                                });
                                if(res.data.success){
                                    const imageUrl = res.data.data[0];
                                    setFormData(prev => ({...prev, image: imageUrl}));
                                    alert("Image selected! Click 'Save Changes' to update profile.");
                                }
                            } catch (error) {
                                console.error(error);
                                alert("Failed to upload image");
                            }
                        }}
                    />
                </label>
             )}

             <h2 className="text-xl font-bold text-text-primary">{user.name}</h2>
             <p className="text-sm text-text-secondary">{user.email}</p>
             
             <div className="flex items-center gap-2 mt-3 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 rounded-full border border-yellow-100 dark:border-yellow-900/50">
                <span className="font-bold text-yellow-700 dark:text-yellow-500">{user.averageRating?.toFixed(1) || "0.0"}</span>
                <FiStar className="text-yellow-500 fill-current" />
                <span className="text-xs text-yellow-600 dark:text-yellow-600">({user.ratingCount || 0} reviews)</span>
             </div>
          </div>

          <nav className="bg-surface p-4 rounded-2xl shadow-sm border border-border-color flex flex-col gap-2">
            <TabButton id="profile" icon={FiUser} label="Profile" />
            <TabButton id="orders" icon={FiShoppingBag} label="Orders" />
            <TabButton id="listings" icon={FiBox} label="Listings" />
            <TabButton id="settings" icon={FiSettings} label="Settings" />
            
            <hr className="my-2 border-border-color" />
            
            <button
                onClick={logout}
                className="whitespace-nowrap w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-semibold"
            >
                <FiLogOut size={20} />
                <span className="inline">Logout</span>
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
            {activeTab === "profile" && (
                <div className="bg-surface p-6 md:p-8 rounded-3xl shadow-sm border border-border-color animate-fade-in">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-text-primary">Profile Details</h2>
                        <button 
                            onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
                            className={`w-full md:w-auto px-6 py-3 md:py-2 rounded-xl font-bold text-white transition shadow-lg md:shadow-none transform active:scale-95 ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-900 hover:bg-black dark:bg-gray-700'}`}
                        >
                            {isEditing ? "Save Changes" : "Edit Profile"}
                        </button>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        {isEditing ? (
                            <>
                                <EditInput label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                <EditInput label="Mobile Number" value={formData.mobileNo} onChange={e => setFormData({...formData, mobileNo: e.target.value})} />
                                <EditInput label="College" value={formData.collegeName} onChange={e => setFormData({...formData, collegeName: e.target.value})} />
                                <EditInput label="Branch" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} />
                                <EditInput label="Year of Study" value={formData.yearOfStudy} onChange={e => setFormData({...formData, yearOfStudy: e.target.value})} />
                                
                                <div className="space-y-2">
                                    <p className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2">Location</p>
                                    <input 
                                       value={formData.location?.address || ""} 
                                       onChange={e => setFormData({...formData, location: { ...(formData.location || {}), address: e.target.value }})}
                                       placeholder="Your City/Area"
                                       className="w-full bg-surface p-4 rounded-xl border border-border-color focus:ring-1 focus:ring-emerald-500 outline-none text-text-primary mb-2"
                                    />
                                    <LocationPicker 
                                        location={formData.location || { address: "", coordinates: { lat: 0, lng: 0 } }} 
                                        setLocation={(newLoc) => setFormData({...formData, location: { ...newLoc, address: formData.location?.address || newLoc.address || "" } })} 
                                    />
                                </div>

                                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 flex flex-col justify-center border border-gray-100 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Email (Cannot Change)</p>
                                    <p className="text-gray-500">{user.email}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <InfoCard label="Full Name" value={user.name} />
                                <InfoCard label="Email Address" value={user.email} />
                                <InfoCard label="Mobile Number" value={user.mobileNo} />
                                <InfoCard label="College" value={user.collegeName} />
                                <InfoCard label="Branch" value={user.branch} />
                                <InfoCard label="Branch" value={user.branch} />
                                <InfoCard label="Year of Study" value={user.yearOfStudy || "N/A"} />
                                <InfoCard label="Location" value={user.location?.address || "Not set"} />
                            </>
                        )}
                    </div>
                    {isEditing && (
                        <button onClick={() => setIsEditing(false)} className="mt-4 text-red-500 font-semibold hover:underline">
                            Cancel
                        </button>
                    )}
                </div>
            )}

            {activeTab === "orders" && (
                <div className="space-y-4 animate-fade-in">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">My Orders</h2>
                    {loading ? <p>Loading...</p> : myOrders.length === 0 ? <EmptyState msg="No orders yet." /> : 
                        myOrders.map(order => (
                            <div key={order._id} className="bg-surface p-4 md:p-6 rounded-2xl shadow-sm border border-border-color flex flex-col gap-4">
                                {/* Top Row: Image & Details */}
                                <div className="flex gap-4">
                                    <img src={order.item?.images?.[0] || '/placeholder.png'} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl bg-gray-100 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1">
                                            <h3 className="font-bold text-lg text-text-primary truncate pr-2">{order.item?.title || "Unknown Item"}</h3>
                                            <span className={`self-start px-3 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wide uppercase ${
                                                order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>{order.status || "PENDING"}</span>
                                        </div>
                                        <p className="text-emerald-600 font-bold mt-1">₹{order.item?.price}</p>
                                        <div className="mt-2 text-sm text-text-secondary">
                                            <p className="line-clamp-1">Buyer: <span className="font-semibold text-text-primary">{order.buyer?.name}</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider for mobile clarity */}
                                <div className="h-px bg-border-color md:hidden"></div>

                                {/* Bottom Row: Actions */}
                                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-end">
                                    <p className="text-xs text-text-secondary hidden md:block mr-auto">Order ID: {order._id}</p>
                                    
                                    {order.status === "PENDING" && (
                                        <>
                                            <button 
                                                onClick={() => handleUpdateOrderStatus(order._id, 'confirm')}
                                                className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition active:scale-95 shadow-sm"
                                            >
                                                Accept Order
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateOrderStatus(order._id, 'cancel')}
                                                className="flex-1 md:flex-none px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition active:scale-95"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {order.status === "CONFIRMED" && (
                                        <>
                                            <button 
                                                onClick={() => handleUpdateOrderStatus(order._id, 'complete')}
                                                className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition active:scale-95 shadow-sm"
                                            >
                                                Mark Completed
                                            </button>
                                            <Link 
                                                to={`/order/${order._id}`}
                                                className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-100 transition text-center"
                                            >
                                                Chat with Buyer
                                            </Link>
                                        </>
                                    )}
                                    {order.status === "COMPLETED" && (
                                        <Link 
                                            to={`/order/${order._id}`}
                                            className="w-full md:w-auto px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition text-center"
                                        >
                                            View Order Details
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}

            {activeTab === "listings" && (
                 <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-text-primary">My Listings</h2>
                        <Link to="/items/create" className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-700">
                            + Add New
                        </Link>
                    </div>
                    {loading ? <p>Loading...</p> : myItems.length === 0 ? <EmptyState msg="You haven't listed any items." /> : 
                        myItems.map(item => (
                            <div key={item._id} className="bg-surface p-4 rounded-2xl shadow-sm border border-border-color flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <img src={item.images?.[0] || '/placeholder.png'} className="w-16 h-16 object-cover rounded-lg bg-gray-100 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-text-primary line-clamp-1 text-base">{item.title}</h3>
                                        <p className="text-emerald-600 font-bold">₹{item.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                     <Link 
                                        to={`/items/edit/${item._id}`}
                                        className="flex-1 md:flex-none py-2 px-4 bg-blue-50 text-blue-600 rounded-xl text-center text-sm font-bold hover:bg-blue-100 transition"
                                     >
                                         Edit
                                     </Link>
                                     <button 
                                        onClick={() => handleDeleteItem(item._id)}
                                        className="flex-1 md:flex-none py-2 px-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition"
                                     >
                                         Delete
                                     </button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            )}

            {activeTab === "settings" && (
                <div className="bg-surface p-8 rounded-3xl shadow-sm border border-border-color animate-fade-in">
                    <h2 className="text-2xl font-bold text-text-primary mb-6">Settings</h2>
                    <div className="flex items-center justify-between p-4 bg-primary rounded-xl">
                        <div>
                            <p className="font-bold text-text-primary">Appearance</p>
                            <p className="text-sm text-text-secondary">Switch between light and dark themes</p>
                        </div>
                        <button 
                            onClick={toggleTheme}
                            className="bg-white border border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-md transition"
                        >
                            {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        </button>
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

const EditInput = ({ label, value, onChange }) => (
    <div className="bg-surface p-4 rounded-xl border border-border-color transition-all focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
        <p className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-2">{label}</p>
        <input 
            type="text" 
            value={value} 
            onChange={onChange}
            className="w-full bg-transparent border-none focus:ring-0 p-0 font-semibold text-text-primary"
        />
    </div>
);

const InfoCard = ({ label, value }) => (
    <div className="bg-surface p-4 rounded-xl border border-border-color">
        <p className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-1">{label}</p>
        <p className="text-text-primary font-semibold">{value}</p>
    </div>
);

const EmptyState = ({ msg }) => (
    <div className="text-center py-12 bg-surface rounded-2xl border-2 border-dashed border-border-color">
        <p className="text-text-secondary">{msg}</p>
    </div>
);

export default UserAccount;
