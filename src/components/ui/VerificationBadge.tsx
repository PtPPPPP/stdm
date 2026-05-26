import { Badge } from './Badge';
import type { BadgeVariant } from './Badge';

const VERIFIED_VARIANT: Record<string, BadgeVariant> = {
  verified: 'verified',
  pending: 'pending',
};

const VERIFIED_LABEL: Record<string, string> = {
  verified: '已核验',
  pending: '待核验',
};

export function VerificationBadge({
  verified,
  className = '',
}: {
  verified: string;
  className?: string;
}) {
  const variant = VERIFIED_VARIANT[verified] ?? 'unverified';
  const label = VERIFIED_LABEL[verified] ?? '未核验';
  return <Badge label={label} variant={variant} className={className} />;
}
