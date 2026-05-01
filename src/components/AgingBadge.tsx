import { Badge } from '@/components/ui/badge';
import { getAgingSeverity, type AgingSeverity } from '@/utils/aging';

interface AgingBadgeProps {
  daysInStock: number;
}

const severityConfig: Record<AgingSeverity, { variant: 'warning' | 'critical' | 'default'; label: string }> = {
  normal: { variant: 'default', label: '' },
  warning: { variant: 'warning', label: 'Aging' },
  critical: { variant: 'critical', label: 'Critical' },
};

function AgingBadge({ daysInStock }: AgingBadgeProps) {
  const severity = getAgingSeverity(daysInStock);
  if (severity === 'normal') return null;

  const config = severityConfig[severity];
  return (
    <Badge variant={config.variant} className="ml-2">
      {config.label}
    </Badge>
  );
}

export default AgingBadge;
