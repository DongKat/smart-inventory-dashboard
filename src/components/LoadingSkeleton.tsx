import { Card, CardContent } from '@/components/ui/card';

function SkeletonBar({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}

function LoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading dashboard">
      {/* KPI skeletons */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <SkeletonBar className="mb-2 h-4 w-24" />
              <SkeletonBar className="h-7 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter skeleton */}
      <div className="mb-6">
        <SkeletonBar className="h-10 w-full max-w-md" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border bg-white">
        <div className="border-b bg-slate-50 px-4 py-3">
          <SkeletonBar className="h-4 w-full" />
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b px-4 py-3">
            <SkeletonBar className="h-4 w-32" />
            <SkeletonBar className="h-4 w-12" />
            <SkeletonBar className="h-4 w-20" />
            <SkeletonBar className="h-4 w-16" />
            <SkeletonBar className="h-4 w-24" />
            <SkeletonBar className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;
