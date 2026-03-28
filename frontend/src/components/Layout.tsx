import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiOutlineSquares2X2,
  HiOutlineUsers,
  HiOutlineTruck,
  HiOutlineCalendarDays,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

const navItems = [
  { to: "/", icon: HiOutlineSquares2X2, label: "Dashboard" },
  { to: "/customers", icon: HiOutlineUsers, label: "Customers" },
  { to: "/vehicles", icon: HiOutlineTruck, label: "Vehicles" },
  { to: "/bookings", icon: HiOutlineCalendarDays, label: "Bookings" },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-925 sidebar-pattern flex flex-col">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-925" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.25a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zM3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm5.5 1.5a1.5 1.5 0 00-1.5 1.5v2a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5V8a1.5 1.5 0 00-1.5-1.5h-3z" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-white tracking-tight">
                RentWheels
              </h1>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest">
                Fleet Admin
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-500/15 text-brand-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 mb-3">
            <div className="w-8 h-8 bg-brand-500/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-brand-400">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <HiArrowRightOnRectangle className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-[#faf8f5]">
        <Outlet />
      </main>
    </div>
  );
}
