export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="container py-10 text-sm opacity-80">
        © {new Date().getFullYear()} Denil Dominic. All rights reserved.
      </div>
    </footer>
  );
}
