import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

import { getGuidePdf } from '../../services/Envios';
import { getEnviosErrorMessage } from '../../utils/envios';
import type { EnviosCarrier } from '../../types';

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

    const variantClass = variant === 'primary'
        ? 'bg-gradient-to-r from-[#1E6BFF] to-blue-700 text-white shadow-lg shadow-blue-900/30 hover:from-blue-600 hover:to-blue-800'
        : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10';

    return (
        <div className="flex flex-col items-start gap-1.5">
            <button
                type="button"
                onClick={() => void handleClick()}
                disabled={loading}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 ${variantClass}`}
            >
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Download className="h-4 w-4" />
                )}
                {loading ? 'Generando...' : label}
            </button>
            {error && (
                <span className="max-w-xs text-xs text-red-600 dark:text-red-400">
                    {error}
                </span>
            )}
        </div>
    );
};

export default GuidePdfButton;
