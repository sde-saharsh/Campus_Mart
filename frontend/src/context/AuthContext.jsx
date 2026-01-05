import { createContext, useContext, useState ,useEffect} from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return null;
      const parsed = JSON.parse(storedUser);
      // only accept stored user if it looks valid (has an id or _id)
      if (parsed && (parsed.id || parsed._id)) return parsed;
      return null;
    } catch (err) {
      console.error("Invalid user in localStorage");
      return null;
    }
  });

  const login = (userData, token) => {
    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
    }
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t && !user) {
      api
        .get("/user/me")
        .then((res) => setUser(res.data.data))
        .catch(() => setUser(null));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token);

  const refreshUser = async () => {
    if (!token) return;
    try {
      const res = await api.get("/user/me");
      if (res.data.success) {
        setUser(res.data.data);
        localStorage.setItem("user", JSON.stringify(res.data.data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
