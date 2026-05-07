import { Skeleton } from "@/components/ui/skeleton";

export default function FraudLoading() {
  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-7 rounded-lg" />
            </div>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[220px_1fr]">
        <div className="space-y-3">
          <div className="rounded-xl border border-border/60 bg-card p-3 space-y-2.5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-7 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-card p-4">
                <div className="space-y-2 mb-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-2.5 w-20" />
                </div>
                <Skeleton className="h-44 w-full rounded-lg" />
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border/60 bg-card">
            <div className="border-b border-border/50 px-4 py-3">
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
