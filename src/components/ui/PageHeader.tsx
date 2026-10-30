import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PageHeader = ({
  title,
  titleAdornment,
  description,
  backTo,
  backLabel = 'Volver',
  actions,
}: {
  title: string;
  titleAdornment?: ReactNode;
  description?: string;
  backTo?: string;
  backLabel?: string;
  actions?: ReactNode;
}) => (
  <header className="mb-8">
    {backTo && (
      <Link
        to={backTo}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {backLabel}
      </Link>
    )}
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {titleAdornment}
        </div>
        {description && (
          <p className="mt-2 text-base leading-relaxed text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-col gap-2 sm:flex-row">{actions}</div>}
    </div>
  </header>
);

export default PageHeader;
