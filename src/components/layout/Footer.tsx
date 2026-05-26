import { dataMeta } from '../../data';
import DataFreshnessBadge from '../data/DataFreshnessBadge';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-brand-500/20">
              <svg viewBox="0 0 64 64" className="h-4 w-4" fill="none">
                <path d="M32 4L58 28L32 60L6 28L32 4Z" stroke="#338EFF" strokeWidth="2" />
                <circle cx="32" cy="28" r="4" fill="#D4AF37" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">
              Diamond Track Atlas · 钻石田径图鉴
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
            本站为田径科普项目，数据以 World Athletics、Diamond League 官方结果页等公开来源为准。
            所有运动员资料和成绩数据仅供学习参考，标注"待核验"的记录尚未与官方来源逐条确认，
            使用前请以 World Athletics（世界田联）或 Diamond League 官方发布为最终依据。
            如发现数据有误，欢迎指正。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span>人工更新：{dataMeta.lastManualUpdate}</span>
            <span>·</span>
            <span>自动同步：{dataMeta.lastAutoSync ?? '暂无'}</span>
            <DataFreshnessBadge />
          </div>
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Diamond Track Atlas. Built for
            education and fandom.
          </p>
        </div>
      </div>
    </footer>
  );
}
