export function EmptyState({
  icon = '📭',
  title,
  description,
  action,
  className = 'py-20',
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; to: string };
  className?: string;
}) {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500">{description}</p>}
      {action && (
        <a
          href={action.to}
          className="inline-block mt-4 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
