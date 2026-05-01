import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  onClearFilters: () => void;
}

function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-white py-16" role="status">
      <SearchX className="mb-4 h-12 w-12 text-slate-300" />
      <h3 className="mb-1 text-lg font-medium text-slate-700">No vehicles match your filters</h3>
      <p className="mb-4 text-sm text-slate-400">Try adjusting your search or filter criteria.</p>
      <Button variant="outline" onClick={onClearFilters}>
        Clear all filters
      </Button>
    </div>
  );
}

export default EmptyState;
