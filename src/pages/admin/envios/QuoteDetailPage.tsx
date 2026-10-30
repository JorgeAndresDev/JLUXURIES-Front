import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Package, Scale, Truck } from 'lucide-react';

import QuoteOptionCard from '../../../components/envios/QuoteOptionCard';
import QuoteStatusBadge from '../../../components/envios/QuoteStatusBadge';
import Alert from '../../../components/ui/Alert';
import { Card, CardHeader } from '../../../components/ui/Card';
import PageHeader from '../../../components/ui/PageHeader';
import StatTile from '../../../components/ui/StatTile';
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
            <div className="page-shell">
                <div className="page-container">
                    <div className="skeleton mb-4 h-4 w-32" />
                    <div className="skeleton mb-2 h-9 w-72" />
                    <div className="skeleton mb-8 h-4 w-96 max-w-full" />
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="skeleton h-24" />
                        ))}
                    </div>
                    <div className="mt-6 skeleton h-80" />
                </div>
            </div>
        );
    }

    if (error || !quote) {
        return (
            <div className="page-shell">
                <div className="page-container max-w-2xl">
                    <PageHeader
                        backTo="/admin/envios/cotizaciones"
                        backLabel="Volver al historial"
                        title="Cotización no disponible"
                    />
                    <Alert tone="error" title="No fue posible abrir la cotización">
                        {error || 'La cotización solicitada no existe.'}
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            <div className="page-container">
                <PageHeader
                    backTo="/admin/envios/cotizaciones"
                    backLabel="Volver al historial"
                    title={`Cotización #${quote.id_cotizacion}`}
                    titleAdornment={<QuoteStatusBadge estado={quote.estado} />}
                    description={`${carrierLabel(quote.transportadora)} · Cotizada el ${formatDateTime(quote.fecha_creacion)}`}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatTile
                        label="Transportadora"
                        value={carrierLabel(quote.transportadora)}
                        icon={<Truck className="h-4 w-4" />}
                    />
                    <StatTile
                        label="Total"
                        value={formatCOP(quote.total)}
                    />
                    <StatTile
                        label="Valor declarado"
                        value={formatCOP(quote.valor_declarado)}
                    />
                    <StatTile
                        label="Peso facturable"
                        value={formatWeight(quote.peso_facturable)}
                        hint={`Volumétrico: ${formatWeight(quote.peso_volumetrico)}`}
                        icon={<Scale className="h-4 w-4" />}
                    />
                </div>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card className="p-6">
                        <CardHeader
                            icon={<MapPin className="h-5 w-5" />}
                            title="Origen y destino"
                            description="Sucursal de despacho y código DANE de entrega"
                        />
                        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">Sucursal</dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {quote.nombre_sucursal}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">Código sucursal</dt>
                                <dd className="mt-1 font-mono text-slate-900 dark:text-white">
                                    {quote.codigo_sucursal}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">Ciudad origen</dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {quote.ciudad_origen}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">Código destino</dt>
                                <dd className="mt-1 font-mono text-slate-900 dark:text-white">
                                    {quote.codigo_destino}
                                </dd>
                            </div>
                        </dl>
                    </Card>

                    <Card className="p-6">
                        <CardHeader
                            icon={<Package className="h-5 w-5" />}
                            title="Paquete y tarifa"
                            description="Base de cálculo usada por la transportadora"
                        />
                        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">Valor producto</dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {formatCOP(quote.valor_producto)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">Flete en declarado</dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {quote.incluye_flete_en_valor_declarado ? 'Sí' : 'No'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">Peso facturable</dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {formatWeight(quote.peso_facturable)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">Peso volumétrico</dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {formatWeight(quote.peso_volumetrico)}
                                </dd>
                            </div>
                        </dl>
                    </Card>
                </div>

                <Card className="mt-6 p-6">
                    <CardHeader
                        icon={<Truck className="h-5 w-5" />}
                        title="Opciones cotizadas"
                        description="Tarifas devueltas en esta consulta"
                    />
                    <div className="mt-5 space-y-4">
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
                </Card>

                {quote.response.no_disponibles.length > 0 && (
                    <div className="mt-6">
                        <Alert tone="warning" title="Transportadoras no disponibles">
                            <ul className="space-y-1">
                                {quote.response.no_disponibles.map((item) => (
                                    <li key={item.transportadora}>
                                        {carrierLabel(item.transportadora)}: {item.mensaje}
                                    </li>
                                ))}
                            </ul>
                        </Alert>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuoteDetailPage;
