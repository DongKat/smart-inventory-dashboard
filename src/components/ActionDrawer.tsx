import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { ActionType } from '@/types/action';
import { ACTION_TYPE_LABELS } from '@/types/action';
import type { VehicleWithAge } from '@/types/vehicle';

interface ActionDrawerProps {
  vehicle: VehicleWithAge | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { type: ActionType; notes: string }) => void;
}

function ActionDrawer({ vehicle, open, onClose, onSubmit }: ActionDrawerProps) {
  const [actionType, setActionType] = useState<ActionType | ''>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!actionType) {
      setError('Please select an action type');
      return;
    }
    onSubmit({ type: actionType, notes });
    setActionType('');
    setNotes('');
    setError('');
    onClose();
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setActionType('');
      setNotes('');
      setError('');
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Action</DialogTitle>
          <DialogDescription>
            {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} — ${vehicle.daysInStock} days in stock` : ''}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="action-type" className="mb-1 block text-sm font-medium text-slate-700">
              Action Type
            </label>
            <Select value={actionType} onValueChange={(val) => { setActionType(val as ActionType); setError(''); }}>
              <SelectTrigger id="action-type" aria-label="Select action type">
                <SelectValue placeholder="Select action type..." />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(ACTION_TYPE_LABELS) as [ActionType, string][]).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="mt-1 text-sm text-red-600" role="alert">{error}</p>}
          </div>

          <div>
            <label htmlFor="action-notes" className="mb-1 block text-sm font-medium text-slate-700">
              Notes
            </label>
            <textarea
              id="action-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              rows={3}
              placeholder="Add details about this action..."
              aria-label="Action notes"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Action</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ActionDrawer;
