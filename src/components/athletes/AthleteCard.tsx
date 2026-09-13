import { memo } from 'react';
import { Link } from 'react-router-dom';
import { competitionResults, getEventById, getAthleteDisplayLatestResult, getRecordedBests, EVENT_CATEGORY_TAG_CLASS } from '../../data';
import type { Athlete } from '../../data';
import { SourceLink } from '../ui/SourceLink';
import { VerificationBadge } from '../ui/VerificationBadge';
import AthleteImage from './AthleteImage';

interface AthleteCardProps {
  athlete: Athlete;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

function AthleteCard({ athlete, isFavorite, onToggleFavorite }: AthleteCardProps) {
  const category = getEventById(athlete.mainEvent)?.category ?? 'sprints';
  const topPB = getRecordedBests(competitionResults, athlete, 'PB')[0];
  const latest = getAthleteDisplayLatestResult(athlete, competitionResults);
  const summaries = [
    { label: '已收录个人最佳 · PB', result: topPB },
    { label: '最近收录比赛', result: latest },
  ];

  return (
    <article className="glass-card-hover flex min-w-0 flex-col p-5">
      <div className="flex items-start gap-3">
        <Link to={`/athletes/${athlete.id}`} className="shrink-0" aria-label={`查看${athlete.name}的资料`}>
          <AthleteImage athlete={athlete} variant="compare" className="h-20 w-16" />
        </Link>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold leading-snug text-white">
            <Link to={`/athletes/${athlete.id}`} className="hover:text-brand-300">{athlete.name}</Link>
          </h3>
          <p className="mt-1 break-words text-xs text-slate-400">{athlete.englishName}</p>
          <p className="mt-2 text-sm text-slate-300">{athlete.country} · {athlete.gender === 'male' ? '男子' : '女子'}</p>
        </div>
        <button type="button" onClick={() => onToggleFavorite(athlete.id)} aria-label={isFavorite ? '取消收藏' : '加入收藏'} aria-pressed={isFavorite}
          className={`shrink-0 rounded-lg p-2 text-xl transition-colors hover:bg-white/10 ${isFavorite ? 'text-track-gold' : 'text-slate-400'}`}>
          <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
        </button>
      </div>
      <div className="my-4 flex flex-wrap gap-2">
        <span className={EVENT_CATEGORY_TAG_CLASS[category]}>主项 · {athlete.mainEvent}</span>
        {athlete.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-300">{tag}</span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {summaries.map(({ label, result }, index) => (
          <div key={label} className={`min-w-0 rounded-xl border p-3 ${index === 0 ? 'border-brand-500/20 bg-brand-500/10' : 'border-white/10 bg-white/5'}`}>
            <p className={`text-xs ${index === 0 ? 'text-brand-300' : 'text-slate-300'}`}>{label}</p>
            <p className="my-2 break-words text-2xl font-bold tabular-nums text-white">{result?.mark ?? '暂无记录'}</p>
            {result && <>
              <p className="text-xs text-slate-300">{result.event}{index === 1 && result.place != null ? ` · 第 ${result.place} 名` : ''}</p>
              <p className="mt-2 text-xs text-slate-400">{result.date}</p>
              <div className="mt-2"><VerificationBadge verified={result.source.verified} /></div>
            </>}
          </div>
        ))}
      </div>
      {latest && <p className="mt-2 text-xs leading-relaxed text-slate-400">最近参赛：{latest.competitionName}</p>}
      <div className="my-4">
        <p className="mb-2 text-xs text-slate-400">技术特点</p>
        <div className="flex flex-wrap gap-1.5">
          {athlete.strengths.slice(0, 3).map((strength) => (
            <span key={strength} className="rounded-md bg-brand-500/10 px-2 py-1 text-xs text-brand-300">{strength}</span>
          ))}
        </div>
      </div>
      <div className="mt-auto">
        {(topPB || latest) && (
          <details className="mb-3 text-xs text-slate-400">
            <summary className="cursor-pointer py-1 hover:text-white">成绩来源</summary>
            {summaries.map(({ label, result }) => result && (
              <div key={label} className="mt-2">
                <p>{label}</p>
                <SourceLink sourceName={result.source.sourceName} sourceUrl={result.source.sourceUrl} updatedAt={result.source.updatedAt} />
              </div>
            ))}
          </details>
        )}
        <Link to={`/athletes/${athlete.id}`} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white">
          查看详细资料 <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default memo(AthleteCard);
