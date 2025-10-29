import Link from "next/link";

export default function EmptyState({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="text-center py-20 card border border-white/10 bg-white/5">
      <div className="mx-auto size-12 rounded-2xl bg-white/10 grid place-items-center text-2xl">
        🔎
      </div>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      )}
      {action && (
        <div className="mt-4">
          <Link href={action.href} className="btn-ghost">
            {action.label}
          </Link>
        </div>
      )}
    </div>
  );
}
