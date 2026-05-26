interface StatBadgeProps {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export default function StatBadge({ label, value, highlight }: StatBadgeProps) {
  return (
    <div
      className={`flex flex-col items-center rounded-xl px-4 py-3 ${
        highlight
          ? 'bg-brand-500/15 border border-brand-500/30'
          : 'bg-white/5 border border-white/10'
      }`}
    >
      <span className="text-lg font-bold text-white">{value}</span>
      <span className="text-xs text-slate-400 mt-0.5">{label}</span>
    </div>
  );
}
