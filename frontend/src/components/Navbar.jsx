import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

import {
  FiMenu,
  FiX,
  FiHome,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiLogOut,
  FiBox,
  FiSun,
  FiMoon
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { useNotification } from "../context/NotificationContext";
import { FiBell } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount, notifications } = useNotification();
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const ThemeToggle = () => (
    <button 
      onClick={(e) => {
        e.preventDefault();
        console.log('Toggle clicked, current:', theme);
        toggleTheme();
      }} 
      className="p-2 rounded-full hover:bg-emerald-50 dark:hover:bg-slate-700 transition cursor-pointer text-text-primary"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      type="button"
    >
      {theme === 'dark' ? <FiSun className="text-yellow-400" size={20} /> : <FiMoon className="text-text-primary" size={20} />}
    </button>
  );

  const NotificationIcon = () => (
    <div className="relative">
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative cursor-pointer hover:bg-emerald-50 dark:hover:bg-green-100 p-2 rounded-full transition outline-none"
      >
        <FiBell size={20} className="text-text-primary " />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            {unreadCount > 4 ? '4+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showNotifications && (
        <>
        <div className="fixed inset-0 z-[90] z-index-50 " onClick={() => setShowNotifications(false)}></div>
        <div className="absolute right-0 mt-2 w-80 dark:bg-slate-700 bg-white rounded-xl shadow-lg border border-border-color overflow-hidden z-[100] animate-fade-in max-w-[90vw]">
            <div className="p-3 border-b border-border-color bg-surface">
                <h3 className="font-bold text-text-primary">Notifications</h3>
            </div>
            <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-text-secondary text-sm">
                        No new notifications
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <Link 
                            key={notif.orderId}
                            to={`/order/${notif.orderId}`}
                            onClick={() => setShowNotifications(false)}
                            className="block p-3 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition border-b border-border-color last:border-none"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-sm text-text-primary">{notif.senderName}</p>
                                    <p className="text-xs text-text-secondary truncate max-w-[180px]">{notif.lastMessage}</p>
                                </div>
                                {notif.count > 0 && (
                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {notif.count} new
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
        </>
      )}
    </div>
  );

  const NavLinks = () => (
    <>
      <Link to="/" className={`nav-link ${isActive("/") ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : ""}`} onClick={() => setOpen(false)}>
        <FiHome /> Home
        {isActive("/") && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full md:hidden"></span>}
      </Link>

      {user ? (
        <>
          <Link to="/orders" className={`nav-link ${isActive("/orders") ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : ""}`} onClick={() => setOpen(false)}>
            <FiShoppingBag /> Orders
          </Link>

          <Link to="/items" className={`nav-link ${isActive("/items") ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : ""}`} onClick={() => setOpen(false)}>
            <FiBox /> Items
          </Link>

          <Link to="/favorite" className={`nav-link ${isActive("/favorite") ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : ""}`} onClick={() => setOpen(false)}>
            <FiHeart /> Favorites
          </Link>

          <Link to="/my-account" className={`nav-link ${isActive("/my-account") ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : ""}`} onClick={() => setOpen(false)}>
            {user.image ? (
                <img src={user.image} alt="Profile" className="w-5 h-5 rounded-full object-cover border-none" />
            ) : (
                <FiUser />
            )}
            Account
          </Link>

          <button onClick={logout} className="nav-link text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
            <FiLogOut /> Logout
          </button>
        </>
      ) : (
        <>
           <Link to="/items" className={`nav-link ${isActive("/items") ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : ""}`} onClick={() => setOpen(false)}>
            <FiBox /> Browse
          </Link>
          <Link to="/login" className="nav-link" onClick={() => setOpen(false)}>
            Login
          </Link>
          <Link to="/register" className="bg-emerald-500 text-white px-5 py-2 rounded-full font-bold shadow-md hover:bg-emerald-600 transition" onClick={() => setOpen(false)}>
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="w-full bg-transparent border-b border-white/5 shadow-sm fixed top-0 z-50 transition-all duration-300 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <img
              src="/logo.png"
              alt="logo"
              className="h-9 w-9 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
            />
            <span className="text-xl font-bold text-accent group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
              CampusMart
            </span>
          </Link>


          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-text-primary">
            {/* Notification Bell */}
            <NotificationIcon />

            <NavLinks />
            <div className="h-6 w-px bg-border-color mx-2"></div>
            <ThemeToggle />
          </div>

          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <NotificationIcon />
            {/* Mobile Menu Icon */}
            <button
                onClick={() => setOpen(true)}
                className="text-2xl text-text-primary"
            >
                <FiMenu />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-nav-bg z-50 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b">
          <span className="text-lg font-semibold text-accent">
            Menu
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FiX size={24} />
          </button>

        </div>

        {/* Sidebar Links */}
        <div className="flex flex-col p-4 gap-4 text-text-primary">
          <NavLinks />
        </div>
      </aside>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
