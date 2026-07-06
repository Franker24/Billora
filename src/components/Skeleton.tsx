import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  key?: React.Key;
}

export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse bg-slate-200/80 rounded-md ${className}`} 
      style={{ animationDuration: '1.5s' }}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-6 border border-slate-200 rounded-xl space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-36" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="p-4 space-y-4">
        {/* Table Header skeleton */}
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={`h-${i}`} className="h-4 w-2/3" />
          ))}
        </div>
        <div className="border-t border-slate-100 my-2" />
        {/* Rows skeleton */}
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`r-${r}`} className="grid gap-4 items-center" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={`r-${r}-c-${c}`} className={`h-4 ${c === 0 ? 'w-5/6' : c === cols - 1 ? 'w-12 rounded-full h-5' : 'w-2/3'}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white p-6 border border-slate-200 rounded-xl space-y-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-48" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
      {/* Visual Chart Bars Representation */}
      <div className="h-60 flex items-end gap-3 pt-6 border-b border-l border-slate-100 px-2">
        {Array.from({ length: 12 }).map((_, i) => {
          const heights = ['h-1/4', 'h-1/3', 'h-1/2', 'h-2/3', 'h-3/4', 'h-1/2', 'h-3/5', 'h-4/5', 'h-5/6', 'h-2/3', 'h-1/2', 'h-3/4'];
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <Skeleton className={`w-full ${heights[i % heights.length]} rounded-t-sm`} />
              <Skeleton className="h-2 w-6" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-3 w-80" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <div>
          <div className="bg-white p-6 border border-slate-200 rounded-xl space-y-4 shadow-xs">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
            <div className="space-y-3 pt-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
