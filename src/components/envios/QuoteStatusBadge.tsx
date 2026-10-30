import Badge from '../ui/Badge';
import { quoteStateLabel } from '../../utils/envios';
import type { QuoteState } from '../../types';

interface QuoteStatusBadgeProps {
    estado: QuoteState;
    className?: string;
}

const toneByState = {
    seleccionada: 'brand',
    usada: 'success',
    anulada: 'neutral',
} as const;

const QuoteStatusBadge = ({ estado, className = '' }: QuoteStatusBadgeProps) => (
    <Badge tone={toneByState[estado]} className={className}>
        {quoteStateLabel(estado)}
    </Badge>
);

export default QuoteStatusBadge;
