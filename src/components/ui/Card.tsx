import type { ReactNode } from 'react';

export const Card = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => <section className={`card ${className}`}>{children}</section>;

export const CardHeader = ({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex items-start gap-3">
      {icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
          {icon}
        </span>
      )}
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
    </div>
    {action}
  </div>
);

export const Tile = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => <div className={`tile ${className}`}>{children}</div>;
