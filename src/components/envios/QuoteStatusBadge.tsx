import { quoteStateClass, quoteStateLabel } from '../../utils/envios';
import type { QuoteState } from '../../types';

interface QuoteStatusBadgeProps {
    estado: QuoteState;
    className?: string;
}

const QuoteStatusBadge = ({ estado, className = '' }: QuoteStatusBadgeProps) => (
    <span
        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${quoteStateClass(estado)} ${className}`}
    >
        {quoteStateLabel(estado)}
    </span>
);

export default QuoteStatusBadge;
