import type { Action } from '@/types/action';
import { ACTION_TYPE_LABELS } from '@/types/action';
import { Badge } from '@/components/ui/badge';

interface ActionHistoryProps {
  actions: Action[];
}

function ActionHistory({ actions }: ActionHistoryProps) {
  if (actions.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-slate-400" role="status">
        No actions recorded yet.
      </p>
    );
  }

  const sorted = [...actions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-slate-700">Action History</h4>
      <ul className="space-y-2" aria-label="Action history">
        {sorted.map((action) => (
          <li key={action.id} className="rounded-md border px-3 py-2">
            <div className="flex items-center gap-2">
              <Badge variant="default">{ACTION_TYPE_LABELS[action.type]}</Badge>
              <span className="text-xs text-slate-400">
                {new Date(action.createdAt).toLocaleDateString()} by {action.managerName}
              </span>
            </div>
            {action.notes && <p className="mt-1 text-sm text-slate-600">{action.notes}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActionHistory;
