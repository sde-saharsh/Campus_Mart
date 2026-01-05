import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { FiSearch, FiFilter, FiStar, FiUser, FiMapPin, FiBriefcase } from "react-icons/fi";

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
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["All", "Electronics", "Books", "Clothing", "Furniture", "Sports", "Other"];

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

  useEffect(() => {
    let result = items;
    
    // Search Filter
    if (search) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Category Filter
    if (filters.category !== "All") {
      result = result.filter((item) => item.category === filters.category);
    }

    // College Filter (Match seller's college)
    if (filters.college) {
        result = result.filter(item => 
            item.seller?.collegeName?.toLowerCase().includes(filters.college.toLowerCase())
        );
    }

    // Location Filter (Match seller's location address)
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

  // Extract unique colleges and locations for suggestions/dropdown if needed
  // For now simple inputs or we can derive unique values:
  const locations = [...new Set(items.map(i => i.seller?.location?.address).filter(Boolean))];
  const colleges = [...new Set(items.map(i => i.seller?.collegeName).filter(Boolean))];

  return (
    <div className="min-h-screen bg-primary py-12 px-4 md:px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* <h1 className="text-4xl font-bold text-text-primary mb-8">Explore Items</h1> */}

        {/* Filters Bar */}
        {/* Filters Bar */}
        <div className="bg-surface p-4 rounded-2xl shadow-sm border border-border-color mb-10">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                
                {/* Search & Toggle Wrapper */}
                <div className="w-full md:w-[28rem] lg:w-[32rem] flex gap-2">
                    <div className="relative flex-grow">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                        type="text"
                        placeholder="Search items..."
                        className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-border-color bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {/* Mobile Filter Toggle */}
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="md:hidden p-2.5 bg-surface border border-border-color rounded-xl text-text-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition shadow-sm"
                    >
                        <FiFilter className={showFilters ? "text-emerald-600" : "text-gray-400"} size={20} />
                    </button>
                </div>

                {/* Filters Group */}
                <div className={`flex flex-col md:flex-row gap-4 w-full md:w-auto transition-all duration-300 ease-in-out overflow-hidden ${
                    showFilters ? "max-h-[500px] opacity-100 mt-4 md:mt-0" : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
                }`}>
                    {/* Category */}
                    <div className="relative min-w-[160px]">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                        className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-border-color focus:outline-none focus:ring-2 focus:ring-emerald-600 bg-primary text-text-primary appearance-none cursor-pointer"
                        value={filters.category}
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                        >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                        </select>
                    </div>

                    {/* College Filter */}
                    <div className="relative min-w-[200px]">
                        <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text"
                            list="colleges"
                            placeholder="Filter by College"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-color bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-text-secondary"
                            value={filters.college}
                            onChange={(e) => handleFilterChange("college", e.target.value)}
                        />
                        <datalist id="colleges">
                            {colleges.map((c, i) => <option key={i} value={c} />)}
                        </datalist>
                    </div>

                    {/* Location Filter */}
                    <div className="relative min-w-[200px]">
                        <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text"
                            list="locations"
                            placeholder="Filter by Location"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-color bg-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-text-secondary"
                            value={filters.location}
                            onChange={(e) => handleFilterChange("location", e.target.value)}
                        />
                        <datalist id="locations">
                            {locations.map((l, i) => <option key={i} value={l} />)}
                        </datalist>
                    </div>
                </div>
            </div>
        </div>

        {/* Grid */}
        {loading ? (
          <p className="text-center text-text-secondary text-lg">Loading items...</p>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-text-secondary">No items found matching your filters.</p>
             <button onClick={() => {setSearch(""); setFilters({category: "All", college: "", location: ""})}} className="text-emerald-600 font-semibold hover:underline mt-2">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredItems.map((item) => (
              <Link
                to={`/item/${item._id}`}
                key={item._id}
                className="group bg-surface rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-border-color"
              >
                <div className="h-32 md:h-56 overflow-hidden relative bg-primary">
                  <img
                    src={item.images?.[0] || "/placeholder.png"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 backdrop-blur-sm bg-white/70 dark:bg-black/50 px-2 py-0.5 rounded-lg text-[10px] md:text-xs font-bold shadow-sm text-gray-800 dark:text-white">
                    {item.category}
                  </div>
                </div>
                
                <div className="p-3 md:p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="text-sm md:text-lg font-bold text-text-primary line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                      {item.title}
                    </h2>
                  </div>
                  <p className="text-text-secondary text-[10px] md:text-sm mb-2 md:mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto mb-3 pt-3 border-t border-border-color">
                      <div className="flex flex-col">
                          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                              <FiUser className="text-emerald-500" />
                              <span className="truncate max-w-[80px]">{item.seller?.name}</span>
                          </div>
                      </div>
                      {item.seller?.averageRating > 0 && (
                          <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-md">
                              {item.seller?.averageRating?.toFixed(1)} <FiStar className="fill-current" size={10} />
                          </div>
                      )}
                  </div>

                   {/* Location/College Tags on Card */}
                   <div className="flex gap-2 mb-3 text-[10px] text-text-secondary overflow-hidden">
                       {item.seller?.location?.address && <span className="flex items-center gap-1 truncate"><FiMapPin /> {item.seller.location.address}</span>}
                    </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-base md:text-xl font-bold text-emerald-600">₹{item.price}</span>
                    <span className="hidden md:block text-xs text-gray-400">
                       {new Date(item.createdAt).toLocaleDateString()}
                    </span>
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
