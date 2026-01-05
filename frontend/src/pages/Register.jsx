import { useState } from "react";
import api from "../utils/api.js";;
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import LocationPicker from "../components/LocationPicker";

const Register = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobileNo: "",
    collegeName: "",
    branch: "",
    yearOfStudy: "",
    location: {
        address: "",
        coordinates: { lat: 0, lng: 0 }
    }
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (newLocation) => {
      setForm({ ...form, location: newLocation });
  }

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/register", form);
      const token = res.data?.token || res.data?.data?.token;
      const user = res.data?.user || res.data?.data || res.data?.data?.user;
      if (!token) throw new Error('Missing auth token');
      login(user, token);
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Registration failed';
      alert(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
        <form onSubmit={submit} className="bg-surface p-8 rounded-3xl shadow-xl w-full max-w-lg space-y-6">
            <h2 className="text-3xl font-bold text-center text-text-primary">Create Account</h2>
           
            {step === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right">
                    <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full bg-primary border border-border-color rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" required />
                    <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full bg-primary border border-border-color rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" required />
                    <input name="mobileNo" placeholder="Mobile Number" value={form.mobileNo} onChange={handleChange} className="w-full bg-primary border border-border-color rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" required />
                    <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full bg-primary border border-border-color rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" required />
                    
                    <button type="button" onClick={() => setStep(2)} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">Next</button>
                    <p className="text-center text-sm text-text-secondary">Already have an account? <Link to="/login" className="text-emerald-600 font-bold">Login</Link></p>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4 animate-in slide-in-from-right">
                    <input name="collegeName" placeholder="College Name" value={form.collegeName} onChange={handleChange} className="w-full bg-primary border border-border-color rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" required />
                    <div className="grid grid-cols-2 gap-4">
                        <input name="branch" placeholder="Branch" value={form.branch} onChange={handleChange} className="w-full bg-primary border border-border-color rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" required />
                        <input name="yearOfStudy" placeholder="Year (e.g., 2nd Year)" value={form.yearOfStudy} onChange={handleChange} className="w-full bg-primary border border-border-color rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500" required />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-text-secondary">Your Location (City/Area)</label>
                        <input 
                            value={form.location.address} 
                            onChange={(e) => setForm({...form, location: { ...form.location, address: e.target.value }})}
                            placeholder="Type City Name (e.g. Pune)" 
                            className="w-full bg-primary border border-border-color rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <div className="text-xs text-text-secondary mb-1">Mark your location on map:</div>
                        <LocationPicker location={form.location} setLocation={handleLocationChange} />
                    </div>

                    <div className="flex gap-4">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition">Back</button>
                        <button type="submit" className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition">Register</button>
                    </div>
                </div>
            )}
        </form>
    </div>
  );
};

export default Register;
