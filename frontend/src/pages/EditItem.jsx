import { useEffect, useState } from "react";
import api from "../utils/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiUploadCloud, FiX, FiCheck } from "react-icons/fi";

const EditItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        price: "",
        category: "Electronics",
        subCategory: "",
        description: "",
        images: [],
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    const categories = ["Electronics", "Books", "Clothing", "Furniture", "Sports", "Other"];

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await api.get(`/item/${id}`);
                if (res.data.success) {
                    const item = res.data.data;
                    setForm({
                        title: item.title,
                        price: item.price,
                        category: item.category,
                        subCategory: item.subCategory,
                        description: item.description,
                        images: item.images || []
                    });
                    setImagePreviews(item.images || []);
                }
            } catch (err) {
                console.error(err);
                alert("Failed to fetch item details");
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);


    // Handle text change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle Image Upload
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));

        try {
            const res = await api.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data.success) {
                const newImages = [...form.images, ...res.data.data];
                // Limit to 5 images
                if (newImages.length > 5) {
                    alert("Maximum 5 images allowed.");
                    setUploading(false);
                    return;
                }
                setForm({ ...form, images: newImages });
                setImagePreviews(newImages);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        const newImages = form.images.filter((_, i) => i !== index);
        setForm({ ...form, images: newImages });
        setImagePreviews(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.images.length === 0) return alert("Please upload at least one image");

        try {
            setLoading(true);
            const res = await api.put(`/item/${id}`, form);
            if (res.data.success) {
                alert("Item updated successfully!");
                navigate(`/item/${id}`);
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update item");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-primary py-10 px-4 transition-colors duration-300">
            <div className="max-w-3xl mx-auto bg-surface p-8 rounded-3xl shadow-sm border border-border-color">
                <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold text-text-primary">Edit Item</h2>
                     <button onClick={() => navigate(-1)} className="text-text-secondary hover:text-text-primary">Cancel</button>
                </div>
               
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-text-primary font-semibold mb-2">Item Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="w-full p-3 rounded-xl border border-border-color bg-surface text-text-primary focus:ring-2 focus:ring-emerald-600 outline-none transition-all"
                            placeholder="e.g. Engineering Physics Textbook"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Price */}
                        <div>
                            <label className="block text-text-primary font-semibold mb-2">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                required
                                className="w-full p-3 rounded-xl border border-border-color bg-surface text-text-primary focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-text-primary font-semibold mb-2">Category</label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full p-3 rounded-xl border border-border-color bg-surface text-text-primary focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Sub Category */}
                    <div>
                        <label className="block text-text-primary font-semibold mb-2">Sub Category (Optional)</label>
                         <input
                            type="text"
                            name="subCategory"
                            value={form.subCategory}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl border border-border-color bg-surface text-text-primary focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="e.g. 1st Year, CSE"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-text-primary font-semibold mb-2">Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full p-3 rounded-xl border border-border-color bg-surface text-text-primary focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="Describe condition, year, version etc."
                        ></textarea>
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-text-primary font-semibold mb-2">Item Images (Max 5)</label>
                        
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-4">
                            {imagePreviews.map((src, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                                    <img src={src} alt="priview" className="w-full h-full object-cover" />
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <FiX size={12} />
                                    </button>
                                </div>
                            ))}
                            {imagePreviews.length < 5 && (
                                <label className="cursor-pointer border-2 border-dashed border-border-color rounded-xl flex flex-col items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition aspect-square">
                                    <FiUploadCloud size={24} className="text-gray-400 mb-2" />
                                    <span className="text-xs text-gray-500 text-center">{uploading ? "..." : "Add"}</span>
                                    <input 
                                        type="file" 
                                        multiple 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleImageChange}
                                        disabled={uploading}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition transform hover:-translate-y-1 ${
                            loading 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 dark:shadow-none"
                        }`}
                    >
                        {loading ? "Updating..." : "Update Item"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default EditItem;
