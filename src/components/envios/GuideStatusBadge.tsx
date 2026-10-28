import { guideStateClass, guideStateLabel } from '../../utils/envios';
import type { GuideState } from '../../types';

interface GuideStatusBadgeProps {
    estado: GuideState;
    className?: string;
}

const GuideStatusBadge = ({ estado, className = '' }: GuideStatusBadgeProps) => (
    <span
        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${guideStateClass(estado)} ${className}`}
    >
        {guideStateLabel(estado)}
    </span>
);

export default GuideStatusBadge;
