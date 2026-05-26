import { dataMeta, getFreshnessStatus } from '../../data';

const STATUS_CONFIG = {
  fresh: {
    label: '数据新鲜',
    dot: 'bg-green-400',
    text: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/30',
  },
  aging: {
    label: '数据可能已过期',
    dot: 'bg-amber-400',
    text: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/30',
  },
  stale: {
    label: '数据可能已过期',
    dot: 'bg-red-400',
    text: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/30',
  },
} as const;

export default function DataFreshnessBadge() {
  const status = getFreshnessStatus();
  const config = STATUS_CONFIG[status];
  const lastUpdate = dataMeta.lastAutoSync ?? dataMeta.lastManualUpdate;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.border} ${config.text}`}
      title={`最近自动同步：${dataMeta.lastAutoSync ?? '暂无'}；最近人工更新：${dataMeta.lastManualUpdate}；用于判断的最近更新时间：${lastUpdate}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
