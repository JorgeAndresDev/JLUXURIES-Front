import Badge from '../ui/Badge';
import { guideStateLabel } from '../../utils/envios';
import type { GuideState } from '../../types';

interface GuideStatusBadgeProps {
    estado: GuideState;
    className?: string;
}

const toneByState = {
    creada: 'brand',
    pdf_generado: 'success',
    pdf_error: 'warning',
    cancelada: 'danger',
} as const;

const GuideStatusBadge = ({ estado, className = '' }: GuideStatusBadgeProps) => (
    <Badge tone={toneByState[estado]} className={className}>
        {guideStateLabel(estado)}
    </Badge>
);

export default GuideStatusBadge;
