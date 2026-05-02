import type { VehicleWithAge } from '@/types/vehicle';
import type { Action } from '@/types/action';
import { ACTION_TYPE_LABELS } from '@/types/action';
import type { SortField, SortDirection } from '@/stores/inventoryStore';
import { paginate } from '@/hooks/usePagination';
import { Button } from '@/components/ui/button';
import AgingBadge from '@/components/AgingBadge';
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, ClipboardPen } from 'lucide-react';

interface InventoryTableProps {
  vehicles: VehicleWithAge[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onRowClick?: (vehicle: VehicleWithAge) => void;
  onRecordAction?: (vehicle: VehicleWithAge) => void;
  actionsMap?: Map<string, Action[]>;
}

function SortIcon({ field, activeField, direction }: { field: SortField; activeField: SortField; direction: SortDirection }) {
  if (field !== activeField) return <ChevronsUpDown className="ml-1 inline h-3 w-3 text-slate-300" />;
  return direction === 'asc'
    ? <ChevronUp className="ml-1 inline h-3 w-3" />
    : <ChevronDown className="ml-1 inline h-3 w-3" />;
}

function sortVehicles(vehicles: VehicleWithAge[], field: SortField, direction: SortDirection): VehicleWithAge[] {
  return [...vehicles].sort((a, b) => {
    let cmp = 0;
    switch (field) {
      case 'make':
        cmp = `${a.make} ${a.model}`.localeCompare(`${b.make} ${b.model}`);
        break;
      case 'year':
        cmp = a.year - b.year;
        break;
      case 'price':
        cmp = a.price - b.price;
        break;
      case 'daysInStock':
        cmp = a.daysInStock - b.daysInStock;
        break;
      case 'location':
        cmp = a.location.localeCompare(b.location);
        break;
      case 'status':
        cmp = a.status.localeCompare(b.status);
        break;
    }
    return direction === 'asc' ? cmp : -cmp;
  });
}

const columns: { label: string; field: SortField }[] = [
  { label: 'Vehicle', field: 'make' },
  { label: 'Year', field: 'year' },
  { label: 'Price', field: 'price' },
  { label: 'Days In Stock', field: 'daysInStock' },
  { label: 'Location', field: 'location' },
  { label: 'Status', field: 'status' },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

function InventoryTable({
  vehicles,
  sortField,
  sortDirection,
  onSort,
  currentPage,
  onPageChange,
  pageSize,
  onRowClick,
  onRecordAction,
  actionsMap,
}: InventoryTableProps) {
  const sorted = sortVehicles(vehicles, sortField, sortDirection);
  const { paginatedItems, totalPages, hasNextPage, hasPreviousPage, startIndex, endIndex } = paginate(sorted, {
    currentPage,
    pageSize,
    totalItems: sorted.length,
  });

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full table-fixed text-sm" role="table">
          <colgroup>
            <col style={{ width: '24%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '10%' }} />
            {onRecordAction && <col style={{ width: '18%' }} />}
          </colgroup>
          <thead>
            <tr className="border-b bg-slate-50">
              {columns.map((col) => (
                <th
                  key={col.field}
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 select-none"
                  onClick={() => onSort(col.field)}
                  aria-sort={sortField === col.field ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  {col.label}
                  <SortIcon field={col.field} activeField={sortField} direction={sortDirection} />
                </th>
              ))}
              {onRecordAction && <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((vehicle) => {
              const vehicleActions = actionsMap?.get(vehicle.id) ?? [];
              const lastAction = vehicleActions.length > 0
                ? vehicleActions.reduce((latest, a) => new Date(a.createdAt) > new Date(latest.createdAt) ? a : latest)
                : null;

              return (
              <tr
                key={vehicle.id}
                className={`border-b transition-colors hover:bg-slate-50 ${onRowClick ? 'cursor-pointer' : ''} ${vehicle.isAging ? 'bg-amber-50/50' : ''}`}
                onClick={() => onRowClick?.(vehicle)}
                data-testid={`vehicle-row-${vehicle.id}`}
              >
                <td className="px-4 py-3 font-medium">
                  {vehicle.make} {vehicle.model}
                  <span className="block text-xs text-slate-400">{vehicle.trim} • {vehicle.exteriorColor}</span>
                </td>
                <td className="px-4 py-3">{vehicle.year}</td>
                <td className="px-4 py-3">{formatPrice(vehicle.price)}</td>
                <td className="px-4 py-3" data-testid="days-in-stock">
                  {vehicle.daysInStock}
                  <AgingBadge daysInStock={vehicle.daysInStock} />
                </td>
                <td className="px-4 py-3">{vehicle.location}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    vehicle.status === 'available' ? 'bg-green-100 text-green-700' :
                    vehicle.status === 'reserved' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {vehicle.status}
                  </span>
                </td>
                {onRecordAction && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {vehicle.isAging && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); onRecordAction(vehicle); }}
                          aria-label={`Record action for ${vehicle.make} ${vehicle.model}`}
                        >
                          <ClipboardPen className="mr-1 h-3 w-3" />
                          Action
                        </Button>
                      )}
                      {lastAction && (
                        <span className="text-xs text-slate-400">
                          {ACTION_TYPE_LABELS[lastAction.type]} • {new Date(lastAction.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>
                )}
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing {startIndex + 1}–{endIndex} of {vehicles.length}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InventoryTable;
