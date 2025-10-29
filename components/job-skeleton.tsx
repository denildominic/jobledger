export default function JobSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-xl bg-white/10" />
        <div className="flex-1">
          <div className="h-4 w-2/3 rounded bg-white/10" />
          <div className="mt-2 h-3 w-1/3 rounded bg-white/10" />
        </div>
        <div className="h-8 w-14 rounded bg-white/10" />
      </div>
      <div className="mt-4 h-3 w-full rounded bg-white/10" />
      <div className="mt-2 h-3 w-5/6 rounded bg-white/10" />
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-20 rounded-xl bg-white/10" />
        <div className="h-8 w-20 rounded-xl bg-white/10" />
      </div>
    </div>
  );
}
