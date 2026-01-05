import { useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/user/login", form);
      // handle different response shapes
      const token = res.data?.token || res.data?.data?.token;
      const user = res.data?.user || res.data?.data || res.data?.data?.user;
      if (!token) {
        // fallback: if backend returned just success and token in res.data
        throw new Error('Missing auth token');
      }
      login(user, token);
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Login failed';
      alert(msg);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-4 space-y-4">
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full border rounded px-3 py-2"
      />
      <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
    </form>
  );
};

export default Login;
