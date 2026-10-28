import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';

import QuoteOptionCard from '../../../components/envios/QuoteOptionCard';
import QuoteStatusBadge from '../../../components/envios/QuoteStatusBadge';
import { getQuoteDetail } from '../../../services/Envios';
import {
    carrierLabel,
    formatCOP,
    formatDateTime,
    formatWeight,
    getEnviosErrorMessage,
} from '../../../utils/envios';
import type { QuoteDetail } from '../../../types';

const QuoteDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [quote, setQuote] = useState<QuoteDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchQuote = useCallback(async () => {
        const quoteId = Number(id);
        if (!Number.isFinite(quoteId) || quoteId <= 0) {
            setError('La cotización solicitada no es válida.');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await getQuoteDetail(quoteId);
            setQuote(data);
            setError(null);
        } catch (err) {
            setQuote(null);
            setError(getEnviosErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void fetchQuote();
    }, [fetchQuote]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-[#1E6BFF]" />
                </div>
            </div>
        );
    }

    if (error || !quote) {
        return (
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="mx-auto max-w-2xl text-center">
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
                        <p className="text-lg font-semibold">{error || 'Cotización no encontrada'}</p>
                    </div>
                    <Link
                        to="/admin/envios/cotizaciones"
                        className="inline-flex items-center gap-2 font-semibold text-[#1E6BFF] hover:text-blue-500"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al historial
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="mx-auto max-w-6xl">
                    <Link
                        to="/admin/envios/cotizaciones"
                        className="mb-4 inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al historial
                    </Link>

                    <div className="mb-8 flex flex-wrap items-center gap-3">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Cotización #{quote.id_cotizacion}
                        </h1>
                        <QuoteStatusBadge estado={quote.estado} />
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Transportadora</p>
                            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{carrierLabel(quote.transportadora)}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Total</p>
                            <p className="mt-1 text-lg font-bold text-green-600 dark:text-green-400">{formatCOP(quote.total)}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Valor declarado</p>
                            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{formatCOP(quote.valor_declarado)}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Fecha</p>
                            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{formatDateTime(quote.fecha_creacion)}</p>
                        </div>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Origen y destino</h2>
                            <dl className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <dt className="text-gray-500 dark:text-gray-400">Sucursal</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-white">{quote.nombre_sucursal}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 dark:text-gray-400">Código sucursal</dt>
                                    <dd className="mt-1 font-mono text-gray-900 dark:text-white">{quote.codigo_sucursal}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 dark:text-gray-400">Ciudad origen</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-white">{quote.ciudad_origen}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 dark:text-gray-400">Código destino</dt>
                                    <dd className="mt-1 font-mono text-gray-900 dark:text-white">{quote.codigo_destino}</dd>
                                </div>
                            </dl>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Paquete y tarifa</h2>
                            <dl className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <dt className="text-gray-500 dark:text-gray-400">Valor producto</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-white">{formatCOP(quote.valor_producto)}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 dark:text-gray-400">Flete incluido en declarado</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                                        {quote.incluye_flete_en_valor_declarado ? 'Sí' : 'No'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 dark:text-gray-400">Peso facturable</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-white">{formatWeight(quote.peso_facturable)}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 dark:text-gray-400">Peso volumétrico</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-white">{formatWeight(quote.peso_volumetrico)}</dd>
                                </div>
                            </dl>
                        </section>
                    </div>

                    <section>
                        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Opciones cotizadas</h2>
                        <div className="space-y-4">
                            {quote.response.opciones.map((option) => (
                                <QuoteOptionCard
                                    key={`${option.transportadora}-${option.cotizacion_id ?? option.total}`}
                                    option={option}
                                    selected={
                                        option.transportadora === quote.response.seleccionada.transportadora
                                    }
                                />
                            ))}
                        </div>
                        {quote.response.no_disponibles.length > 0 && (
                            <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-200">
                                <p className="font-semibold">Transportadoras no disponibles</p>
                                <ul className="mt-2 space-y-1">
                                    {quote.response.no_disponibles.map((item) => (
                                        <li key={item.transportadora}>
                                            {carrierLabel(item.transportadora)}: {item.mensaje}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default QuoteDetailPage;
