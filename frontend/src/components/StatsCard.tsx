import { motion } from "framer-motion";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: boolean;
  delay?: number;
}

export default function StatsCard({ label, value, icon, accent, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`relative overflow-hidden rounded-xl p-5 ${
        accent
          ? "bg-slate-925 text-white"
          : "bg-white border border-slate-100"
      }`}
    >
      {accent && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-brand-500" />
          <div className="absolute -right-2 -bottom-8 w-16 h-16 rounded-full bg-brand-400" />
        </div>
      )}
      <div className="relative flex items-start justify-between">
        <div>
          <p className={`text-xs font-medium uppercase tracking-wider ${accent ? "text-slate-400" : "text-slate-400"}`}>
            {label}
          </p>
          <p className={`mt-2 text-2xl font-display font-bold ${accent ? "text-brand-400" : "text-slate-900"}`}>
            {value}
          </p>
        </div>
        <div className={`p-2.5 rounded-lg ${accent ? "bg-white/10" : "bg-slate-50"}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
