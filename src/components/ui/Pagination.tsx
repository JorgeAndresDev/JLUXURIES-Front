import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  pageIndex: number;
  pageSize: number;
  total: number;
  itemLabel: string;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const navButtonClass =
  'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10';

const Pagination = ({
  pageIndex,
  pageSize,
  total,
  itemLabel,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/70 px-5 py-3.5 dark:border-white/10 dark:bg-white/[0.02] md:flex-row">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Mostrando <span className="font-medium text-slate-700 dark:text-slate-200">{start}–{end}</span> de{' '}
        <span className="font-medium text-slate-700 dark:text-slate-200">{total}</span> {itemLabel}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          Filas
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none transition focus:border-brand-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => onPageChange(0)} disabled={pageIndex === 0} aria-label="Primera página" className={navButtonClass}>
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onPageChange(pageIndex - 1)} disabled={pageIndex === 0} aria-label="Página anterior" className={navButtonClass}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-24 px-2 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
            {pageIndex + 1} / {pageCount}
          </span>
          <button type="button" onClick={() => onPageChange(pageIndex + 1)} disabled={pageIndex >= pageCount - 1} aria-label="Página siguiente" className={navButtonClass}>
            <ChevronRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => onPageChange(pageCount - 1)} disabled={pageIndex >= pageCount - 1} aria-label="Última página" className={navButtonClass}>
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
