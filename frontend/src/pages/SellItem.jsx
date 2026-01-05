import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { FiUploadCloud, FiX } from "react-icons/fi";

const SellItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    subCategory: "",
  });

  const categories = [
    "Electronics",
    "Books",
    "Clothing",
    "Furniture",
    "Sports",
    "Other"
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert("You can only upload up to 5 images");
      return;
    }
    
    setImages([...images, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]); // cleanup
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload Images
      let imageUrls = [];
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach(image => {
          imageFormData.append('images', image);
        });

        const uploadRes = await api.post('/upload', imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (uploadRes.data.success) {
          imageUrls = uploadRes.data.data;
        }
      }

      // 2. Create Item
      const itemData = {
        ...formData,
        images: imageUrls
      };

      await api.post('/item/add', itemData);
      
      alert("Item listed successfully!");
      navigate('/items');

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary py-10 px-4">
      <div className="max-w-3xl mx-auto bg-surface rounded-2xl shadow-xl overflow-hidden border border-border-color">
        <div className="bg-emerald-700 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Sell an Item</h1>
          <p className="text-emerald-50 mt-2 font-medium">List your item for sale in seconds.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Title & Price */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-primary font-medium mb-1">Item Title</label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-2 rounded-lg border border-border-color bg-surface text-text-primary focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="e.g. Engineering Graphics Kit"
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-text-primary font-medium mb-1">Price (₹)</label>
              <input
                type="number"
                name="price"
                required
                className="w-full px-4 py-2 rounded-lg border border-border-color bg-surface text-text-primary focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="e.g. 500"
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-text-primary font-medium mb-1">Category</label>
              <select
                name="category"
                required
                className="w-full px-4 py-2 rounded-lg border border-border-color bg-surface text-text-primary focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                onChange={handleInputChange}
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-text-primary font-medium mb-1">Sub Category / Tag</label>
              <input
                type="text"
                name="subCategory"
                required
                className="w-full px-4 py-2 rounded-lg border border-border-color bg-surface text-text-primary focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                placeholder="e.g. 1st Year, CSE, Dorm"
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-text-primary font-medium mb-1">Description</label>
            <textarea
              name="description"
              required
              rows="4"
              className="w-full px-4 py-2 rounded-lg border border-border-color bg-surface text-text-primary focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              placeholder="Describe the condition, age, and details of your item..."
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-text-primary font-medium mb-2">Upload Images (Max 5)</label>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {previewImages.map((src, i) => (
                <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border-color">
                  <img src={src} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}

              {previewImages.length < 5 && (
                <label className="border-2 border-dashed border-border-color rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition aspect-square">
                  <FiUploadCloud className="text-3xl text-text-secondary" />
                  <span className="text-xs text-text-secondary mt-1">Add Photo</span>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Listing Item..." : "List Item Now"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default SellItem;
