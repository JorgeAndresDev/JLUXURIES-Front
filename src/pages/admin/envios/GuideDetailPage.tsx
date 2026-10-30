import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Clock3,
    MapPin,
    Package,
    Truck,
    User,
} from 'lucide-react';

import GuidePdfButton from '../../../components/envios/GuidePdfButton';
import GuideStatusBadge from '../../../components/envios/GuideStatusBadge';
import Alert from '../../../components/ui/Alert';
import Badge from '../../../components/ui/Badge';
import { Card, CardHeader } from '../../../components/ui/Card';
import PageHeader from '../../../components/ui/PageHeader';
import StatTile from '../../../components/ui/StatTile';
import { getGuideDetail } from '../../../services/Envios';
import {
    carrierLabel,
    formatCOP,
    formatDate,
    formatDateTime,
    formatWeight,
    getEnviosErrorMessage,
} from '../../../utils/envios';
import type { GuideDetail } from '../../../types';

const GuideDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [guide, setGuide] = useState<GuideDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGuide = useCallback(async () => {
        const guideId = Number(id);
        if (!Number.isFinite(guideId) || guideId <= 0) {
            setError('La guía solicitada no es válida.');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const data = await getGuideDetail(guideId);
            setGuide(data);
            setError(null);
        } catch (err) {
            setGuide(null);
            setError(getEnviosErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        void fetchGuide();
    }, [fetchGuide]);

    if (loading) {
        return (
            <div className="page-shell">
                <div className="page-container">
                    <div className="skeleton mb-4 h-4 w-32" />
                    <div className="skeleton mb-2 h-9 w-64" />
                    <div className="skeleton mb-8 h-4 w-96 max-w-full" />
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="skeleton h-24" />
                        ))}
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="skeleton h-64" />
                        <div className="skeleton h-64" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !guide) {
        return (
            <div className="page-shell">
                <div className="page-container max-w-2xl">
                    <PageHeader
                        backTo="/admin/envios/guias"
                        backLabel="Volver al historial"
                        title="Guía no disponible"
                    />
                    <Alert tone="error" title="No fue posible abrir la guía">
                        {error || 'La guía solicitada no existe.'}
                    </Alert>
                </div>
            </div>
        );
    }

    const recipient = guide.request.destinatario;
    const pdfUrl = guide.pdf_url ?? guide.response.pdf_url;
    const pdfError = guide.pdf_error ?? guide.response.pdf_error;
    const isSynced = guide.request.origen === '99envios';
    const quoteId = Number(guide.cotizacion_id);

    return (
        <div className="page-shell">
            <div className="page-container">
                <PageHeader
                    backTo="/admin/envios/guias"
                    backLabel="Volver al historial"
                    title={`Guía ${guide.numero_guia}`}
                    titleAdornment={
                        <div className="flex flex-wrap items-center gap-2">
                            <GuideStatusBadge estado={guide.estado} />
                            {isSynced && <Badge tone="neutral">Sincronizada desde 99envíos</Badge>}
                        </div>
                    }
                    description={`${carrierLabel(guide.transportadora)} · Creada el ${formatDateTime(guide.fecha_creacion)}`}
                    actions={(
                        <GuidePdfButton
                            numeroGuia={guide.numero_guia}
                            transportadora={guide.transportadora}
                            aplicaContrapago={guide.request.aplica_contrapago}
                            pdfUrl={pdfUrl}
                            pdfEndpoint={guide.response.pdf_endpoint}
                            variant="primary"
                        />
                    )}
                />

                {pdfError && (
                    <div className="mb-6">
                        <Alert tone="warning" title="La guía existe, pero el PDF no se generó correctamente">
                            {pdfError}
                        </Alert>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatTile
                        label="Transportadora"
                        value={carrierLabel(guide.transportadora)}
                        icon={<Truck className="h-4 w-4" />}
                    />
                    <StatTile
                        label="Valor declarado"
                        value={formatCOP(guide.valor_declarado)}
                    />
                    <StatTile
                        label="Cotización"
                        value={Number.isFinite(quoteId) && quoteId > 0 ? (
                            <Link
                                to={`/admin/envios/cotizaciones/${quoteId}`}
                                className="text-brand-600 hover:underline dark:text-brand-400"
                            >
                                #{guide.cotizacion_id}
                            </Link>
                        ) : '—'}
                    />
                    <StatTile
                        label="Última actualización"
                        value={formatDate(guide.fecha_actualizacion)}
                        hint={formatDateTime(guide.fecha_actualizacion)}
                        icon={<Clock3 className="h-4 w-4" />}
                    />
                </div>

                {guide.response.mensaje && (
                    <div className="mt-6">
                        <Alert tone="info">{guide.response.mensaje}</Alert>
                    </div>
                )}

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card className="p-6">
                        <CardHeader
                            icon={<User className="h-5 w-5" />}
                            title="Destinatario"
                            description="Persona que recibe el envío"
                        />
                        <div className="mt-5 space-y-4">
                            <div>
                                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {recipient.nombre || 'Destinatario sin nombre'}
                                </p>
                                {(recipient.tipo_documento || recipient.numero_documento) && (
                                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                        {recipient.tipo_documento} {recipient.numero_documento}
                                        {recipient.dv ? `-${recipient.dv}` : ''}
                                    </p>
                                )}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                {[recipient.telefono, recipient.correo].filter(Boolean).join(' · ')
                                    || 'Sin datos de contacto'}
                            </p>
                            <div className="flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-200">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                <span>
                                    {recipient.direccion || 'Dirección no disponible'}
                                    {recipient.id_localidad && ` · DANE ${recipient.id_localidad}`}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <CardHeader
                            icon={<Package className="h-5 w-5" />}
                            title="Paquete"
                            description="Contenido y condiciones del envío"
                        />
                        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">Contenido</dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {guide.request.contenido}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">Peso real</dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {isSynced ? 'No disponible' : formatWeight(guide.request.peso_kg)}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">Dimensiones</dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {isSynced
                                        ? 'No disponible'
                                        : `${guide.request.largo_cm} × ${guide.request.ancho_cm} × ${guide.request.alto_cm} cm`}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">Contrapago</dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {guide.request.aplica_contrapago ? 'Sí' : 'No'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">Seguro</dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {guide.request.seguro99
                                        ? 'Seguro 99'
                                        : guide.request.seguro99plus
                                            ? 'Seguro 99 Plus'
                                            : 'Sin seguro adicional'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">Fecha de creación</dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {formatDate(guide.fecha_creacion)}
                                </dd>
                            </div>
                        </dl>
                        {guide.request.observaciones && (
                            <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600 dark:border-white/10 dark:text-slate-300">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                    Observaciones:{' '}
                                </span>
                                {guide.request.observaciones}
                            </p>
                        )}
                    </Card>
                </div>

                <Card className="mt-6 p-6">
                    <CardHeader
                        icon={<Clock3 className="h-5 w-5" />}
                        title="Eventos"
                        description="Trazabilidad registrada para esta guía"
                    />
                    {guide.eventos.length === 0 ? (
                        <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                            No hay eventos registrados.
                        </p>
                    ) : (
                        <ol className="mt-5">
                            {guide.eventos.map((event, index) => (
                                <li key={event.id_evento} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />
                                        {index < guide.eventos.length - 1 && (
                                            <span className="mt-1 w-px flex-1 bg-slate-200 dark:bg-white/10" />
                                        )}
                                    </div>
                                    <div className={index < guide.eventos.length - 1 ? 'pb-6' : ''}>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {event.estado}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                                            {formatDateTime(event.fecha_creacion)}
                                        </p>
                                        {event.detalle && (
                                            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                                                {event.detalle}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default GuideDetailPage;
