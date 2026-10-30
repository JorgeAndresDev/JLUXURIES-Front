import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

import { getGuidePdf } from '../../services/Envios';
import { getEnviosErrorMessage } from '../../utils/envios';
import type { EnviosCarrier } from '../../types';
import { buttonClass } from '../ui/buttonStyles';

interface GuidePdfButtonProps {
    numeroGuia: string;
    transportadora: EnviosCarrier;
    aplicaContrapago?: boolean;
    pdfUrl?: string | null;
    pdfEndpoint?: string | null;
    variant?: 'primary' | 'secondary';
    label?: string;
}

const GuidePdfButton = ({
    numeroGuia,
    transportadora,
    aplicaContrapago = false,
    pdfUrl,
    pdfEndpoint,
    variant = 'secondary',
    label = 'Descargar PDF',
}: GuidePdfButtonProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClick = async () => {
        setError(null);
        if (pdfUrl) {
            window.open(pdfUrl, '_blank', 'noopener,noreferrer');
            return;
        }

        setLoading(true);
        try {
            const blob = await getGuidePdf(
                numeroGuia,
                transportadora,
                aplicaContrapago,
                pdfEndpoint ?? null,
            );
            const url = URL.createObjectURL(blob);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = `${numeroGuia}.pdf`;
            anchor.rel = 'noopener';
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
        } catch (err) {
            setError(getEnviosErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-start gap-1.5">
            <button
                type="button"
                onClick={() => void handleClick()}
                disabled={loading}
                aria-busy={loading}
                className={buttonClass(variant)}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                    <Download className="h-4 w-4" aria-hidden="true" />
                )}
                {loading ? 'Generando…' : label}
            </button>
            {error && (
                <span role="alert" className="max-w-xs text-xs text-red-600 dark:text-red-400">
                    {error}
                </span>
            )}
        </div>
    );
};

export default GuidePdfButton;
