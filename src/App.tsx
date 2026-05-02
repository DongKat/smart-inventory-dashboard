import { useEffect, useMemo, useState, useCallback } from 'react';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useActionStore } from '@/stores/actionStore';
import { applyAllFilters } from '@/utils/filters';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import InventoryTable from '@/components/InventoryTable';
import EmptyState from '@/components/EmptyState';
import ActionDrawer from '@/components/ActionDrawer';
import ActionHistory from '@/components/ActionHistory';
import KpiCards from '@/components/KpiCards';
import AgeDistributionChart from '@/components/AgeDistributionChart';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { computeKpis, computeAgeDistribution } from '@/utils/metrics';
import type { VehicleWithAge } from '@/types/vehicle';
import type { ActionType } from '@/types/action';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const {
    vehicles,
    locations,
    isLoading,
    error,
    sortField,
    sortDirection,
    searchQuery,
    locationFilter,
    makeFilter,
    ageRange,
    agingOnly,
    currentPage,
    pageSize,
    loadVehicles,
    loadLocations,
    setSortField,
    setSearchQuery,
    setLocationFilter,
    setMakeFilter,
    setAgeRange,
    setAgingOnly,
    setCurrentPage,
  } = useInventoryStore();

  const { actions, loadActions, addAction, getActionsForVehicle } = useActionStore();

  const [drawerVehicle, setDrawerVehicle] = useState<VehicleWithAge | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    loadVehicles();
    loadLocations();
    loadActions();
  }, [loadVehicles, loadLocations, loadActions]);

  const filteredVehicles = useMemo(
    () => applyAllFilters(vehicles, searchQuery, locationFilter, agingOnly, makeFilter, ageRange),
    [vehicles, searchQuery, locationFilter, agingOnly, makeFilter, ageRange],
  );

  const uniqueMakes = useMemo(
    () => [...new Set(vehicles.map((v) => v.make))].sort(),
    [vehicles],
  );

  const actionsMap = useMemo(() => {
    const map = new Map<string, typeof actions>();
    for (const action of actions) {
      const existing = map.get(action.vehicleId) ?? [];
      existing.push(action);
      map.set(action.vehicleId, existing);
    }
    return map;
  }, [actions]);

  const kpis = useMemo(() => computeKpis(filteredVehicles), [filteredVehicles]);
  const ageDistribution = useMemo(() => computeAgeDistribution(filteredVehicles), [filteredVehicles]);

  const handleRecordAction = useCallback((vehicle: VehicleWithAge) => {
    setDrawerVehicle(vehicle);
    setDrawerOpen(true);
  }, []);

  function handleActionSubmit(data: { type: ActionType; notes: string }) {
    if (!drawerVehicle) return;
    addAction({
      id: uuidv4(),
      vehicleId: drawerVehicle.id,
      type: data.type,
      notes: data.notes,
      createdAt: new Date().toISOString(),
      managerName: 'Manager',
    });
  }

  function handleClearFilters() {
    setSearchQuery('');
    setLocationFilter('');
    setMakeFilter('');
    setAgeRange('');
    setAgingOnly(false);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="mx-auto max-w-7xl px-6 py-16 text-center">
          <p className="mb-4 text-slate-600">Unable to load inventory data. Please try again.</p>
          <Button onClick={() => loadVehicles()}>Retry</Button>
        </main>
      </div>
    );
  }

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-6">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* KPI Cards */}
            <section aria-label="Key metrics" className="mb-6">
              <KpiCards kpis={kpis} />
            </section>

            {/* Age Distribution Chart */}
            <section aria-label="Inventory insights" className="mb-6">
              <AgeDistributionChart data={ageDistribution} />
            </section>

            {/* Filter Bar */}
            <section aria-label="Filters" className="mb-6">
              <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                locationFilter={locationFilter}
                onLocationChange={(val) => setLocationFilter(val === 'all' ? '' : val)}
                makeFilter={makeFilter}
                onMakeChange={setMakeFilter}
                ageRange={ageRange}
                onAgeRangeChange={setAgeRange}
                agingOnly={agingOnly}
                onAgingToggle={setAgingOnly}
                locations={locations}
                makes={uniqueMakes}
                totalResults={filteredVehicles.length}
              />
            </section>

            {/* Inventory Table */}
            <section aria-label="Vehicle inventory" className="mb-6">
              {filteredVehicles.length === 0 ? (
                <EmptyState onClearFilters={handleClearFilters} />
              ) : (
                <InventoryTable
                  vehicles={filteredVehicles}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={setSortField}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  pageSize={pageSize}
                  onRecordAction={handleRecordAction}
                  actionsMap={actionsMap}
                />
              )}
            </section>
          </>
        )}
      </main>

      {/* Action Drawer */}
      <ActionDrawer
        vehicle={drawerVehicle}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSubmit={handleActionSubmit}
      />

      {/* Action History Panel (shown when drawer vehicle selected) */}
      {drawerVehicle && drawerOpen && (
        <div className="fixed bottom-0 right-0 top-0 w-80 border-l bg-white p-4 shadow-lg overflow-y-auto" aria-label="Action history panel">
          <ActionHistory actions={getActionsForVehicle(drawerVehicle.id)} />
        </div>
      )}
    </div>
    </ErrorBoundary>
  );
}

export default App;
