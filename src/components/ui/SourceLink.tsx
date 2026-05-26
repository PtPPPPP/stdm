export function SourceLink({
  sourceName,
  sourceUrl,
  updatedAt,
  className = '',
}: {
  sourceName: string;
  sourceUrl?: string;
  updatedAt?: string;
  className?: string;
}) {
  const content = (
    <span className={`text-xs text-slate-500 ${className}`}>
      来源：{sourceName}
      {updatedAt && ` · 更新于 ${updatedAt}`}
    </span>
  );

  if (sourceUrl) {
    return (
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1 text-xs text-slate-500 hover:text-brand-400 transition-colors ${className}`}
      >
        来源：{sourceName}
        {updatedAt && ` · 更新于 ${updatedAt}`}
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    );
  }

  return content;
}
