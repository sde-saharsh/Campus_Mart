import { useEffect } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import { FiTrash2, FiShoppingCart } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Favorite = () => {
  const { user, refreshUser } = useAuth();
  
  useEffect(() => {
    refreshUser();
  }, []);

  // Ensure favorites is an array and filter out nulls/unpopulated IDs
  const rawFavorites = user?.favorites;
  // console.log("Raw Favorites:", rawFavorites);

  const favorites = (rawFavorites || []).filter(
    (item) => item && typeof item === "object" && item._id
  );
  // console.log("Filtered Favorites:", favorites);

  const removeFavorite = async (id) => {
      try {
          await api.post(`/user/favorite/${id}`);
          await refreshUser(); // Updates global user state which triggers re-render here
      } catch (error) {
          console.error(error);
      }
  }

  return (
    <div className="min-h-screen bg-primary py-12 px-4 md:px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* <h1 className="text-4xl font-bold text-text-primary mb-8">My Favorites</h1>                                                                                                                                                            */}
        
        {/* DEBUG */}
        {/* <pre className="text-xs text-red-500 overflow-auto max-h-40 bg-gray-100 p-4 mb-4">
            {JSON.stringify(favorites, null, 2)}
        </pre>
        <pre className="text-xs text-blue-500 overflow-auto max-h-40 bg-gray-100 p-4 mb-4">
             Raw: {JSON.stringify(user?.favorites, null, 2)}                                                                                   
        </pre> */}

        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-3xl shadow-sm border border-border-color">
            <h2 className="text-2xl font-bold text-text-primary mb-2">No favorites yet</h2>
            <p className="text-text-secondary mb-6">Save items you like to find them later.</p>
            <Link to="/items" className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition">
                Browse Items
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {favorites.map((item) => (
                // Safe check if item is populated object
                 item && typeof item === 'object' && (
                  <div
                    key={item._id}
                    className="group bg-surface rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-border-color hover:-translate-y-1"
                  >
                    <Link to={`/item/${item._id}`} className="block h-32 md:h-56 overflow-hidden relative bg-primary">
                      <img
                        src={item.images?.[0] || "/placeholder.png"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                    
                    <div className="p-3 md:p-5 flex flex-col flex-grow">
                      <h2 className="text-sm md:text-lg font-bold text-text-primary line-clamp-1 mb-1">
                          {item.title}
                      </h2>
                      <p className="text-emerald-600 font-bold text-base md:text-xl mb-2 md:mb-4">₹{item.price}</p>
                      
                      <div className="mt-auto flex gap-1 md:gap-2">
                        <Link to={`/item/${item._id}`} className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold flex items-center justify-center gap-1 md:gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                            <FiShoppingCart className="hidden md:block" /> Buy
                        </Link>
                        <button 
                            onClick={() => removeFavorite(item._id)}
                            className="w-8 md:w-10 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                        >
                            <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                 )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorite;
