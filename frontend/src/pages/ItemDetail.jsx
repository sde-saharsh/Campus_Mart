import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { FiHeart, FiShoppingCart, FiUser, FiClock, FiShare2, FiStar } from "react-icons/fi";

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, refreshUser } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/item/${id}`);
        setItem(res.data?.data || null);
        if (res.data?.data?.images?.length > 0) {
          setMainImage(res.data.data.images[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) return navigate('/login');
    setFavLoading(true);
    try {
      await api.post(`/user/favorite/${id}`);
      await refreshUser(); // Update global user state (which contains favorites)
      // re-fetch item not strictly needed for favorites but good for other updates
      const res = await api.get(`/item/${id}`);
      setItem(res.data?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const buyItem = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (user._id === item.seller._id) {
        alert("You cannot buy your own item!");
        return;
    }

    try {
      if(!confirm("Are you sure you want to place an order?")) return;

      await api.post(`/order/${id}`);
      alert("Order placed successfully! Check 'Orders' page.");
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Could not create order');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `Check out ${item.title} on CampusMart!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy:", err);
            alert("Failed to copy link");
        }
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-emerald-600 animate-pulse">Loading item details...</div>;
  if (!item) return <div className="p-10 text-center text-red-500">Item not found</div>;

  const isFavorite = user?.favorites?.some(f => 
    (typeof f === 'string' ? f : f._id) === item._id
  ) || false;

  return (
    <div className="min-h-screen bg-primary py-12 px-6">
      <div className="max-w-6xl mx-auto bg-surface rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-2">
        
        {/* Image Gallery */}
        <div className="p-8 bg-primary flex flex-col gap-6">
          <div className="aspect-square bg-surface rounded-2xl shadow-sm overflow-hidden flex items-center justify-center">
            <img src={mainImage || '/placeholder.png'} alt={item.title} className="w-full h-full object-contain" />
          </div>
          
          {item.images && item.images.length > 1 && (
             <div className="flex gap-4 overflow-x-auto pb-2">
                {item.images.map((img, i) => (
                    <button 
                        key={i} 
                        onClick={() => setMainImage(img)}
                        className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${mainImage === img ? 'border-emerald-500' : 'border-transparent hover:border-gray-300'}`}
                    >
                        <img src={img} className="w-full h-full object-cover" />
                    </button>
                ))}
             </div>
          )}
        </div>

        {/* Details */}
        <div className="p-10 flex flex-col">
            <div className="flex justify-between items-start">
               <div>
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                     {item.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-text-primary mt-4 leading-tight">{item.title}</h1>
               </div>
               <button onClick={toggleFavorite} className="p-3 bg-surface border border-border-color rounded-full hover:bg-red-50 transition group">
                   <FiHeart className={`text-2xl transition ${isFavorite ? 'text-red-500 fill-red-500' : 'text-text-secondary group-hover:text-red-500'}`} />
               </button>
            </div>

            <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-emerald-700">₹{item.price}</span>
            </div>

            <p className="mt-8 text-text-secondary leading-relaxed text-lg">
                {item.description}
            </p>
            
            <div className="mt-10 pt-8 border-t border-border-color grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                        <FiUser />
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary font-bold uppercase">Seller</p>
                        <p className="text-text-primary font-semibold">{item.seller?.name}</p>
                        <div className="flex items-center gap-1 text-xs text-yellow-500">
                             <span className="font-bold text-text-primary">{item.seller?.averageRating?.toFixed(1) || "0.0"}</span>
                             <FiStar className="fill-current" />
                             <span className="text-text-secondary ml-1">({item.seller?.ratingCount || 0} reviews)</span>
                        </div>
                        <p className="text-xs text-text-secondary">{item.seller?.collegeName}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                        <FiClock />
                    </div>
                    <div>
                        <p className="text-xs text-text-secondary font-bold uppercase">Posted</p>
                        <p className="text-text-primary font-semibold">{new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-8 flex gap-4">
                <button 
                  onClick={buyItem} 
                  className="flex-1 bg-emerald-600 text-white h-14 rounded-xl font-bold text-lg hover:bg-emerald-700 shadow-lg hover:shadow-emerald-200 transition flex items-center justify-center gap-3"
                >
                    <FiShoppingCart /> Buy Now
                </button>
                <button 
                    onClick={handleShare}
                    className="h-14 w-14 border border-border-color rounded-xl flex items-center justify-center text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    title="Share item"
                >
                    <FiShare2 size={24} />
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
