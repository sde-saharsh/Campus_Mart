import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { FiSearch, FiMapPin, FiHeart, FiEye, FiClock } from "react-icons/fi";

const Items = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
      category: "All",
      college: "",
      location: ""
  });

  const categories = ["All", "Electronics", "Books", "Clothing", "Furniture", "Sports", "Other"];

  // Fetch Items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/item/all");
        if (res.data.success) {
          setItems(res.data.data);
          setFilteredItems(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = items;
    // Search
    if (search) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    // Category
    if (filters.category !== "All") {
      result = result.filter((item) => item.category === filters.category);
    }
    // College
    if (filters.college) {
        result = result.filter(item => 
            item.seller?.collegeName?.toLowerCase().includes(filters.college.toLowerCase())
        );
    }
    // Location
    if (filters.location) {
        result = result.filter(item => 
            item.seller?.location?.address?.toLowerCase().includes(filters.location.toLowerCase())
        );
    }
    setFilteredItems(result);
  }, [search, filters, items]);

  const handleFilterChange = (key, value) => {
      setFilters(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#02040a] pt-24 pb-12 px-4 md:px-8 transition-colors duration-300 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Search & Filter Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 p-4 mb-8">
             <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                 {/* Search */}
                 <div className="relative w-full md:w-96">
                     <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input
                         type="text"
                         placeholder="Search for items..."
                         className="w-full pl-12 pr-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-white placeholder-slate-400 font-medium"
                         value={search}
                         onChange={(e) => setSearch(e.target.value)}
                     />
                 </div>

                 {/* Filters */}
                 <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                     <select 
                        className="px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-white font-medium cursor-pointer text-sm"
                        value={filters.category}
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                     >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                     
                     <div className="relative min-w-[180px]">
                        <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            list="locations"
                            placeholder="Filter by location..."
                            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 text-slate-700 dark:text-white font-medium placeholder-slate-400 text-sm"
                            value={filters.location}
                            onChange={(e) => handleFilterChange("location", e.target.value)}
                        />
                     </div>
                 </div>
             </div>
        </div>

        {/* Grid */}
        {loading ? (
             <div className="flex justify-center items-center h-64">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
             </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-white/10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No items found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Try adjusting your search or filters.</p>
             <button onClick={() => {setSearch(""); setFilters({category: "All", college: "", location: ""})}} className="text-emerald-500 font-bold hover:underline">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Link
                to={`/item/${item._id}`}
                key={item._id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Standard Image Area */}
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                      ₹{item.price.toLocaleString()}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                      {item.category}
                  </div>
                </div>
                
                {/* Content Body */}
                <div className="p-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1 truncate">
                    {item.title}
                  </h2>
                  
                  <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                           {item.seller?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {item.seller?.name || "Unknown Seller"}
                      </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                          <FiMapPin size={12} />
                          <span className="truncate max-w-[100px]">{item.seller?.collegeName || "Campus"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                          <FiClock size={12} />
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;
