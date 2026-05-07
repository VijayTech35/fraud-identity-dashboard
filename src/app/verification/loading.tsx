import { Skeleton } from "@/components/ui/skeleton";

export default function VerificationLoading() {
  return (
    <section className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <div className="space-y-2 mb-3">
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-card p-4">
                <Skeleton className="h-4 w-32 mb-3" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border/60 bg-card">
            <div className="border-b border-border/50 px-4 py-3">
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="p-4 space-y-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border/60 bg-card p-4">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-28 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
