import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { HiPlus, HiPencilSquare, HiTrash } from "react-icons/hi2";
import api from "../services/api";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import type { Booking, Customer, Vehicle } from "../types";

interface BookingForm {
  customer: string;
  vehicle: string;
  startDate: string;
  endDate: string;
}

const emptyForm: BookingForm = { customer: "", vehicle: "", startDate: "", endDate: "" };

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusModal, setStatusModal] = useState<Booking | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [form, setForm] = useState<BookingForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = async () => {
    try {
      const [bRes, cRes, vRes] = await Promise.all([
        api.get<Booking[]>("/bookings"),
        api.get<Customer[]>("/customers"),
        api.get<Vehicle[]>("/vehicles"),
      ]);
      setBookings(bRes.data);
      setCustomers(cRes.data);
      setVehicles(vRes.data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const availableVehicles = useMemo(
    () => vehicles.filter((v) => v.status === "available"),
    [vehicles]
  );

  const estimatedTotal = useMemo(() => {
    if (!form.startDate || !form.endDate || !form.vehicle) return null;
    const vehicle = vehicles.find((v) => v._id === form.vehicle);
    if (!vehicle) return null;
    const days = Math.ceil(
      (new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (days <= 0) return null;
    return { days, total: days * vehicle.dailyRate, rate: vehicle.dailyRate };
  }, [form.startDate, form.endDate, form.vehicle, vehicles]);

  const openCreate = () => {
    setForm(emptyForm);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/bookings", form);
      toast.success("Booking created");
      setModalOpen(false);
      fetchAll();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create booking";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusModal || !newStatus) return;
    setSaving(true);
    try {
      await api.put(`/bookings/${statusModal._id}`, { status: newStatus });
      toast.success("Status updated");
      setStatusModal(null);
      fetchAll();
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/bookings/${deleteTarget._id}`);
      toast.success("Booking deleted");
      setDeleteTarget(null);
      fetchAll();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const setField = (field: keyof BookingForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

  const statusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    active: "bg-emerald-100 text-emerald-700",
    completed: "bg-slate-100 text-slate-600",
    cancelled: "bg-red-100 text-red-600",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl font-bold text-slate-900">Bookings</h1>
          <p className="text-sm text-slate-500 mt-1">{bookings.length} total bookings</p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-925 text-white text-sm font-display font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          <HiPlus className="w-4 h-4" />
          New Booking
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-6 bg-white rounded-xl border border-slate-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vehicle</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Start</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">End</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                    No bookings yet. Click "New Booking" to get started.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-900">
                      {b.customer?.name || "—"}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">
                      {b.vehicle ? `${b.vehicle.make} ${b.vehicle.model}` : "—"}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {new Date(b.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {new Date(b.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">
                      {formatCurrency(b.totalAmount)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${statusColor[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setStatusModal(b);
                            setNewStatus(b.status);
                          }}
                          className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        >
                          <HiPencilSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(b)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Create Booking Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Booking">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Customer</label>
            <select
              value={form.customer}
              onChange={(e) => setField("customer", e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
            >
              <option value="">Select a customer</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Vehicle</label>
            <select
              value={form.vehicle}
              onChange={(e) => setField("vehicle", e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
            >
              <option value="">Select an available vehicle</option>
              {availableVehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.make} {v.model} ({v.licensePlate}) — ${v.dailyRate}/day
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setField("startDate", e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setField("endDate", e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
            </div>
          </div>
          {estimatedTotal && (
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">
                  {estimatedTotal.days} day{estimatedTotal.days > 1 ? "s" : ""} × ${estimatedTotal.rate}/day
                </span>
                <span className="font-display font-bold text-slate-900">
                  {formatCurrency(estimatedTotal.total)}
                </span>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-925 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Booking"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Status Modal */}
      <Modal
        isOpen={!!statusModal}
        onClose={() => setStatusModal(null)}
        title="Update Booking Status"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setStatusModal(null)}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-slate-925 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
}
