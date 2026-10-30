import type { ReactNode } from 'react';

const StatTile = ({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
}) => (
  <div className="tile p-4">
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </p>
      {icon && <span className="text-slate-400 dark:text-slate-500">{icon}</span>}
    </div>
    <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{value}</p>
    {hint && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
  </div>
);

export default StatTile;
