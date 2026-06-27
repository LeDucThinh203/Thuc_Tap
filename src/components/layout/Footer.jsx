/**
 * Footer.jsx — Minimal app footer.
 */
export default function Footer() {
  return (
    <footer className="py-3 px-6 border-t border-slate-200 dark:border-surface-700 text-center">
      <p className="text-xs text-slate-400 dark:text-slate-500">
        © {new Date().getFullYear()} Smart Parking System — Powered by AWS
      </p>
    </footer>
  );
}
