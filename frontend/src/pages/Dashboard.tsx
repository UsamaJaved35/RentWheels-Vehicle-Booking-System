import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineCalendarDays,
  HiOutlineUsers,
  HiOutlineTruck,
  HiOutlineBanknotes,
  HiOutlineCheckBadge,
} from "react-icons/hi2";
import api from "../services/api";
import StatsCard from "../components/StatsCard";
import type { DashboardStats } from "../types";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DashboardStats>("/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

  const statusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    active: "bg-emerald-100 text-emerald-700",
    completed: "bg-slate-100 text-slate-600",
    cancelled: "bg-red-100 text-red-600",
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-display text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Fleet overview and recent activity</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        <StatsCard
          label="Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={<HiOutlineBanknotes className="w-5 h-5 text-brand-400" />}
          accent
          delay={0}
        />
        <StatsCard
          label="Total Bookings"
          value={stats.totalBookings}
          icon={<HiOutlineCalendarDays className="w-5 h-5 text-slate-400" />}
          delay={0.05}
        />
        <StatsCard
          label="Customers"
          value={stats.totalCustomers}
          icon={<HiOutlineUsers className="w-5 h-5 text-slate-400" />}
          delay={0.1}
        />
        <StatsCard
          label="Total Vehicles"
          value={stats.totalVehicles}
          icon={<HiOutlineTruck className="w-5 h-5 text-slate-400" />}
          delay={0.15}
        />
        <StatsCard
          label="Available"
          value={stats.availableVehicles}
          icon={<HiOutlineCheckBadge className="w-5 h-5 text-slate-400" />}
          delay={0.2}
        />
      </div>

      {/* Recent Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mt-8 bg-white rounded-xl border border-slate-100 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-display font-semibold text-slate-900">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                    No bookings yet
                  </td>
                </tr>
              ) : (
                stats.recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-900">
                      {b.customer?.name || "—"}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {b.vehicle ? `${b.vehicle.make} ${b.vehicle.model}` : "—"}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {new Date(b.startDate).toLocaleDateString()} —{" "}
                      {new Date(b.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">
                      {formatCurrency(b.totalAmount)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                          statusColor[b.status] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
