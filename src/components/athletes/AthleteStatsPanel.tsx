import { memo } from 'react';
import { getRecordedBests } from '../../data';
import type { CompetitionResult, Athlete } from '../../data';
import StatBadge from './StatBadge';

interface AthleteStatsPanelProps {
  athlete: Athlete;
  results: CompetitionResult[];
}

function AthleteStatsPanel({ athlete, results }: AthleteStatsPanelProps) {
  const pb = getRecordedBests(results, athlete, 'PB')[0];
  const sb = getRecordedBests(results, athlete, 'SB')[0];

  return (
    <div className="grid grid-cols-2 gap-3">
      {pb ? (
        <div className="col-span-2">
          <StatBadge label={`已收录个人最佳 PB · ${pb.event} · ${pb.date.slice(0, 4)}`} value={pb.mark} highlight />
        </div>
      ) : (
        <div className="col-span-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-500">
          暂无个人最佳记录
        </div>
      )}
      {sb ? (
        <StatBadge label={`赛季最佳 SB · ${sb.event} · ${sb.date.slice(0, 4)}`} value={sb.mark} />
      ) : (
        <div className="rounded-lg bg-white/5 px-3 py-2 text-sm text-slate-500">
          暂无赛季最佳记录
        </div>
      )}
      <StatBadge label="已收录荣誉" value={`${athlete.majorHonors.length} 项`} />
    </div>
  );
}

export default memo(AthleteStatsPanel);

