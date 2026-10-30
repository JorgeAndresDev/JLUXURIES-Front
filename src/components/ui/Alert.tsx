import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

type AlertTone = 'error' | 'warning' | 'info' | 'success';

const toneClass: Record<AlertTone, string> = {
  error: 'alert-error',
  warning: 'alert-warning',
  info: 'alert-info',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200',
};

const toneIcon: Record<AlertTone, ReactNode> = {
  error: <XCircle className="h-5 w-5 shrink-0" aria-hidden="true" />,
  warning: <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />,
  info: <Info className="h-5 w-5 shrink-0" aria-hidden="true" />,
  success: <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />,
};

const Alert = ({
  tone = 'info',
  title,
  children,
  action,
}: {
  tone?: AlertTone;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
}) => (
  <div className={`alert ${toneClass[tone]}`} role={tone === 'error' ? 'alert' : 'status'}>
    {toneIcon[tone]}
    <div className="min-w-0 flex-1">
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={title ? 'mt-0.5' : ''}>{children}</div>}
    </div>
    {action}
  </div>
);

export default Alert;
