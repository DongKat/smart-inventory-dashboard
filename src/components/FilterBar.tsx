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
import type { AgeRange } from '@/stores/inventoryStore';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  locationFilter: string;
  onLocationChange: (location: string) => void;
  makeFilter: string;
  onMakeChange: (make: string) => void;
  ageRange: AgeRange;
  onAgeRangeChange: (range: AgeRange) => void;
  agingOnly: boolean;
  onAgingToggle: (aging: boolean) => void;
  locations: Location[];
  makes: string[];
  totalResults: number;
}

const AGE_RANGES: { value: AgeRange; label: string }[] = [
  { value: '0-30', label: '0–30 days' },
  { value: '31-60', label: '31–60 days' },
  { value: '61-90', label: '61–90 days' },
  { value: '91-180', label: '91–180 days' },
  { value: '180+', label: '180+ days' },
];

function FilterBar({
  searchQuery,
  onSearchChange,
  locationFilter,
  onLocationChange,
  makeFilter,
  onMakeChange,
  ageRange,
  onAgeRangeChange,
  agingOnly,
  onAgingToggle,
  locations,
  makes,
  totalResults,
}: FilterBarProps) {
  const hasActiveFilters = searchQuery || locationFilter || makeFilter || ageRange || agingOnly;

  function clearAllFilters() {
    onSearchChange('');
    onLocationChange('');
    onMakeChange('');
    onAgeRangeChange('');
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

      <Select value={makeFilter || 'all'} onValueChange={(val) => onMakeChange(val === 'all' ? '' : val)}>
        <SelectTrigger className="w-[150px]" aria-label="Filter by make">
          <SelectValue placeholder="All Makes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Makes</SelectItem>
          {makes.map((make) => (
            <SelectItem key={make} value={make}>
              {make}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={locationFilter || 'all'} onValueChange={onLocationChange}>
        <SelectTrigger className="w-[160px]" aria-label="Filter by location">
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

      <Select value={ageRange || 'all'} onValueChange={(val) => onAgeRangeChange((val === 'all' ? '' : val) as AgeRange)}>
        <SelectTrigger className="w-[150px]" aria-label="Filter by age range">
          <SelectValue placeholder="All Ages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Ages</SelectItem>
          {AGE_RANGES.map((r) => (
            <SelectItem key={r.value} value={r.value}>
              {r.label}
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
