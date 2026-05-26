/** 通用 Badge 组件 — 替代散落各处的 inline 验证/类别标签 */
export type BadgeVariant = 'verified' | 'pending' | 'unverified' | 'default' | 'gold';

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  verified: 'bg-green-400/10 text-green-400 border-green-400/30',
  pending: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
  unverified: 'bg-slate-400/10 text-slate-400 border-slate-400/30',
  default: 'bg-white/5 text-slate-400 border-white/10',
  gold: 'bg-track-gold/10 text-track-gold border-track-gold/20',
};

export function Badge({
  label,
  variant = 'default',
  className = '',
}: {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${VARIANT_CLASS[variant]} ${className}`}>
      {label}
    </span>
  );
}
