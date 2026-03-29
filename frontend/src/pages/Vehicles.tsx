import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { HiPlus, HiPencilSquare, HiTrash } from "react-icons/hi2";
import api from "../services/api";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import type { Vehicle } from "../types";

interface FormData {
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  color: string;
  dailyRate: string;
  status: Vehicle["status"];
}

const emptyForm: FormData = {
  make: "",
  model: "",
  year: "",
  licensePlate: "",
  color: "",
  dailyRate: "",
  status: "available",
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchVehicles = () => {
    api
      .get<Vehicle[]>("/vehicles")
      .then((res) => setVehicles(res.data))
      .catch(() => toast.error("Failed to load vehicles"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditingId(v._id);
    setForm({
      make: v.make,
      model: v.model,
      year: String(v.year),
      licensePlate: v.licensePlate,
      color: v.color,
      dailyRate: String(v.dailyRate),
      status: v.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      year: Number(form.year),
      dailyRate: Number(form.dailyRate),
    };
    try {
      if (editingId) {
        await api.put(`/vehicles/${editingId}`, payload);
        toast.success("Vehicle updated");
      } else {
        await api.post("/vehicles", payload);
        toast.success("Vehicle added");
      }
      setModalOpen(false);
      fetchVehicles();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Operation failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/vehicles/${deleteTarget._id}`);
      toast.success("Vehicle deleted");
      setDeleteTarget(null);
      fetchVehicles();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Delete failed";
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const setField = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const statusBadge: Record<string, string> = {
    available: "bg-emerald-100 text-emerald-700",
    booked: "bg-amber-100 text-amber-700",
    maintenance: "bg-red-100 text-red-600",
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
          <h1 className="font-display text-2xl font-bold text-slate-900">Vehicles</h1>
          <p className="text-sm text-slate-500 mt-1">{vehicles.length} vehicles in fleet</p>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-925 text-white text-sm font-display font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          <HiPlus className="w-4 h-4" />
          Add Vehicle
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
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Vehicle</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Year</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Plate</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Color</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Rate/Day</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                    No vehicles yet. Click "Add Vehicle" to get started.
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-slate-900">
                      {v.make} {v.model}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">{v.year}</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-600">{v.licensePlate}</td>
                    <td className="px-6 py-3.5 text-slate-500">{v.color || "—"}</td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900">${v.dailyRate}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${statusBadge[v.status]}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(v)}
                          className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        >
                          <HiPencilSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(v)}
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

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Vehicle" : "New Vehicle"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Make</label>
              <input
                type="text"
                value={form.make}
                onChange={(e) => setField("make", e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                placeholder="Toyota"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Model</label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setField("model", e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                placeholder="Camry"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setField("year", e.target.value)}
                required
                min={1900}
                max={2100}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">License Plate</label>
              <input
                type="text"
                value={form.licensePlate}
                onChange={(e) => setField("licensePlate", e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all uppercase"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Color</label>
              <input
                type="text"
                value={form.color}
                onChange={(e) => setField("color", e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                placeholder="White"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Daily Rate ($)</label>
              <input
                type="number"
                value={form.dailyRate}
                onChange={(e) => setField("dailyRate", e.target.value)}
                required
                min={0}
                step="0.01"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              />
            </div>
          </div>
          {editingId && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
              >
                <option value="available">Available</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
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
              {saving ? "Saving..." : editingId ? "Update" : "Add Vehicle"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Vehicle"
        message={`Are you sure you want to delete "${deleteTarget?.make} ${deleteTarget?.model}"?`}
        loading={deleting}
      />
    </div>
  );
}
