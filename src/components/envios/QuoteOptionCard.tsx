import { CheckCircle2, Clock3, Truck } from 'lucide-react';

import { carrierLabel, formatCOP } from '../../utils/envios';
import type { QuoteOption } from '../../types';

interface QuoteOptionCardProps {
    option: QuoteOption;
    selected?: boolean;
    onSelect?: (option: QuoteOption) => void;
}

const formatDays = (days: QuoteOption['dias']): string => {
    if (days === null || days === undefined || days === '') return 'Sin estimado';
    if (typeof days === 'number') {
        return `${days} ${days === 1 ? 'día' : 'días'}`;
    }
    return days;
};

const QuoteOptionCard = ({
    option,
    selected = false,
    onSelect,
}: QuoteOptionCardProps) => {
    const handleSelect = () => {
        onSelect?.(option);
    };

    const content = (
        <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${selected
                        ? 'bg-gradient-to-br from-[#1E6BFF] to-blue-700 text-white'
                        : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300'
                        }`}
                    >
                        <Truck className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {carrierLabel(option.transportadora)}
                            </h3>
                            {selected && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-[#1E6BFF]/30 bg-[#1E6BFF]/10 px-2.5 py-1 text-xs font-semibold text-[#1E6BFF] dark:text-blue-300">
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    Seleccionada
                                </span>
                            )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <span className="inline-flex items-center gap-1.5">
                                <Clock3 className="h-4 w-4" />
                                {formatDays(option.dias)}
                            </span>
                            {option.fecha_entrega && (
                                <span>Entrega: {option.fecha_entrega}</span>
                            )}
                        </div>
                        {!option.cotizacion_id && (
                            <p className="mt-2 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                                Esta opción no devolvió un identificador de cotización.
                            </p>
                        )}
                    </div>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Total
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCOP(option.total)}
                    </p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-200 pt-4 text-sm dark:border-white/10 sm:grid-cols-4">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Flete</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{formatCOP(option.valor)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Sobreflete</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{formatCOP(option.sobreflete)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Contrapago</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{formatCOP(option.valor_contrapago)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Seguro 99</p>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{formatCOP(option.seguro99)}</p>
                </div>
            </div>

            {option.mensaje && (
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{option.mensaje}</p>
            )}

            {onSelect && (
                <div className="mt-4 flex items-center gap-2 border-t border-gray-200 pt-3 text-sm font-semibold dark:border-white/10">
                    <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${selected
                        ? 'border-[#1E6BFF]'
                        : 'border-gray-300 dark:border-gray-500'
                        }`}
                    >
                        {selected && <span className="h-2 w-2 rounded-full bg-[#1E6BFF]" />}
                    </span>
                    <span className={selected ? 'text-[#1E6BFF] dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}>
                        {selected ? 'Transportadora seleccionada' : 'Seleccionar esta transportadora'}
                    </span>
                </div>
            )}
        </>
    );

    if (!onSelect) {
        return (
            <div
                className={`rounded-2xl border p-5 transition-all ${selected
                    ? 'border-[#1E6BFF] bg-blue-50/70 shadow-lg shadow-blue-500/10 dark:border-[#1E6BFF]/70 dark:bg-[#1E6BFF]/10'
                    : 'border-gray-200 bg-white dark:border-white/10 dark:bg-white/5'
                    }`}
            >
                {content}
            </div>
        );
    }

    return (
        <label
            className={`block cursor-pointer rounded-2xl border p-5 transition-all focus-within:ring-2 focus-within:ring-[#1E6BFF] focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-950 ${selected
                ? 'border-[#1E6BFF] bg-blue-50/70 shadow-lg shadow-blue-500/10 dark:border-[#1E6BFF]/70 dark:bg-[#1E6BFF]/10'
                : 'border-gray-200 bg-white hover:border-blue-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-[#1E6BFF]/50'
                }`}
        >
            <input
                type="radio"
                name="envios-carrier"
                className="sr-only"
                checked={selected}
                onChange={handleSelect}
            />
            {content}
        </label>
    );
};

export default QuoteOptionCard;
