import { CheckCircle2, Clock3, Truck } from 'lucide-react';

import { carrierLabel, formatCOP } from '../../utils/envios';
import type { QuoteOption } from '../../types';
import Badge from '../ui/Badge';

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

    const shellClass = [
        'rounded-2xl border p-5 transition-colors',
        selected
            ? 'border-brand-500 bg-brand-50/60 dark:border-brand-500/60 dark:bg-brand-500/10'
            : 'border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.03]',
        onSelect && !selected
            ? 'hover:border-brand-300 dark:hover:border-brand-500/40'
            : '',
    ].filter(Boolean).join(' ');

    const content = (
        <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        selected
                            ? 'bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-300'
                    }`}>
                        <Truck className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                {carrierLabel(option.transportadora)}
                            </h3>
                            {selected && (
                                <Badge tone="brand">
                                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                    Seleccionada
                                </Badge>
                            )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1.5">
                                <Clock3 className="h-4 w-4" />
                                {formatDays(option.dias)}
                            </span>
                            {option.fecha_entrega && (
                                <span>Entrega: {option.fecha_entrega}</span>
                            )}
                        </div>
                        {!option.cotizacion_id && (
                            <p className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
                                Esta opción no devolvió un identificador de cotización.
                            </p>
                        )}
                    </div>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Total
                    </p>
                    <p className="mt-0.5 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                        {formatCOP(option.total)}
                    </p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 text-sm dark:border-white/10 sm:grid-cols-4">
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Flete</p>
                    <p className="mt-0.5 font-semibold tabular-nums text-slate-800 dark:text-slate-200">
                        {formatCOP(option.valor)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Sobreflete</p>
                    <p className="mt-0.5 font-semibold tabular-nums text-slate-800 dark:text-slate-200">
                        {formatCOP(option.sobreflete)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Contrapago</p>
                    <p className="mt-0.5 font-semibold tabular-nums text-slate-800 dark:text-slate-200">
                        {formatCOP(option.valor_contrapago)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Seguro 99</p>
                    <p className="mt-0.5 font-semibold tabular-nums text-slate-800 dark:text-slate-200">
                        {formatCOP(option.seguro99)}
                    </p>
                </div>
            </div>

            {option.mensaje && (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{option.mensaje}</p>
            )}

            {onSelect && (
                <div className="mt-4 flex items-center gap-2 border-t border-slate-200 pt-3 text-sm font-semibold dark:border-white/10">
                    <span className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                        selected
                            ? 'border-brand-500'
                            : 'border-slate-300 dark:border-slate-500'
                    }`}>
                        {selected && <span className="h-2 w-2 rounded-full bg-brand-500" />}
                    </span>
                    <span className={selected
                        ? 'text-brand-600 dark:text-brand-300'
                        : 'text-slate-600 dark:text-slate-300'}
                    >
                        {selected ? 'Transportadora seleccionada' : 'Seleccionar esta transportadora'}
                    </span>
                </div>
            )}
        </>
    );

    if (!onSelect) {
        return <div className={shellClass}>{content}</div>;
    }

    return (
        <label
            className={`block cursor-pointer focus-within:ring-2 focus-within:ring-brand-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-950 ${shellClass}`}
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
