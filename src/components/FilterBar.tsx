import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Location } from '@/types/vehicle';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  locationFilter: string;
  onLocationChange: (location: string) => void;
  agingOnly: boolean;
  onAgingToggle: (aging: boolean) => void;
  locations: Location[];
  totalResults: number;
}

function FilterBar({
  searchQuery,
  onSearchChange,
  locationFilter,
  onLocationChange,
  agingOnly,
  onAgingToggle,
  locations,
  totalResults,
}: FilterBarProps) {
  const hasActiveFilters = searchQuery || locationFilter || agingOnly;

  function clearAllFilters() {
    onSearchChange('');
    onLocationChange('');
    onAgingToggle(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search by make, model, VIN, or year..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          aria-label="Search vehicles"
        />
      </div>

      <Select value={locationFilter} onValueChange={onLocationChange}>
        <SelectTrigger className="w-[180px]" aria-label="Filter by location">
          <SelectValue placeholder="All Locations" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {locations.map((loc) => (
            <SelectItem key={loc.id} value={loc.id}>
              {loc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant={agingOnly ? 'default' : 'outline'}
        onClick={() => onAgingToggle(!agingOnly)}
        aria-pressed={agingOnly}
        aria-label="Toggle aging stock filter"
      >
        Aging Stock Only
      </Button>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearAllFilters} aria-label="Clear all filters">
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      )}

      <span className="ml-auto text-sm text-slate-500" aria-live="polite">
        {totalResults} vehicle{totalResults !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

export default FilterBar;
