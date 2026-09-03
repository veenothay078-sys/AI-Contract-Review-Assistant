import React from 'react';

export default function Skeletons() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Summary Skeleton */}
      <div className="bg-elevated rounded-premium border border-border p-6 sm:p-8 shadow-premium space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-5">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-border rounded-md skeleton-shimmer" />
            <div className="h-4 w-72 bg-card rounded-md skeleton-shimmer" />
          </div>
          <div className="h-8 w-24 bg-border rounded-full skeleton-shimmer" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-border skeleton-shimmer" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-20 bg-elevated rounded skeleton-shimmer" />
                  <div className="h-4 w-40 bg-border rounded skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-card rounded-xl space-y-3">
              <div className="h-4 w-28 bg-elevated rounded skeleton-shimmer" />
              <div className="h-3 w-full bg-border rounded skeleton-shimmer" />
              <div className="h-3 w-full bg-border rounded skeleton-shimmer" />
              <div className="h-3 w-4/5 bg-border rounded skeleton-shimmer" />
            </div>
            
            <div className="p-4 bg-card rounded-xl space-y-3">
              <div className="h-4 w-32 bg-elevated rounded skeleton-shimmer" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 bg-border rounded-lg skeleton-shimmer" />
                <div className="h-10 bg-border rounded-lg skeleton-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Circular Progress Skeleton */}
        <div className="bg-elevated rounded-premium border border-border p-6 shadow-premium flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-36 h-36 rounded-full border-8 border-border flex items-center justify-center skeleton-shimmer">
            <div className="h-6 w-12 bg-elevated rounded skeleton-shimmer" />
          </div>
          <div className="h-4 w-24 bg-border rounded-full mt-6 skeleton-shimmer" />
        </div>

        {/* Right Details/Charts Skeleton */}
        <div className="lg:col-span-2 bg-elevated rounded-premium border border-border p-6 shadow-premium space-y-6">
          <div className="h-5 w-44 bg-border rounded skeleton-shimmer" />
          <div className="h-48 bg-card rounded-xl skeleton-shimmer" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-12 bg-card rounded-xl skeleton-shimmer" />
            <div className="h-12 bg-card rounded-xl skeleton-shimmer" />
            <div className="h-12 bg-card rounded-xl skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
