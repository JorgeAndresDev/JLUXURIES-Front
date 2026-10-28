import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    AlertTriangle,
    ArrowLeft,
    Loader2,
    MapPin,
    Package,
    User,
} from 'lucide-react';

import GuidePdfButton from '../../../components/envios/GuidePdfButton';
import GuideStatusBadge from '../../../components/envios/GuideStatusBadge';
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
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-[#1E6BFF]" />
                </div>
            </div>
        );
    }

    if (error || !guide) {
        return (
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="mx-auto max-w-2xl text-center">
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
                        <p className="text-lg font-semibold">{error || 'Guía no encontrada'}</p>
                    </div>
                    <Link
                        to="/admin/envios/guias"
                        className="inline-flex items-center gap-2 font-semibold text-[#1E6BFF] hover:text-blue-500"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al historial
                    </Link>
                </div>
            </div>
        );
    }

    const recipient = guide.request.destinatario;
    const pdfUrl = guide.pdf_url ?? guide.response.pdf_url;
    const pdfError = guide.pdf_error ?? guide.response.pdf_error;
    const isSynced = guide.request.origen === '99envios';

    return (
        <div className="min-h-screen w-full bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="mx-auto max-w-6xl">
                    <Link
                        to="/admin/envios/guias"
                        className="mb-4 inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al historial
                    </Link>

                    <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                        <div>
                            <div className="mb-2 flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                                    Guía {guide.numero_guia}
                                </h1>
                                <GuideStatusBadge estado={guide.estado} />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                {carrierLabel(guide.transportadora)} · Creada el {formatDateTime(guide.fecha_creacion)}
                                {isSynced && ' · Sincronizada desde 99envíos'}
                            </p>
                        </div>
                        <GuidePdfButton
                            numeroGuia={guide.numero_guia}
                            transportadora={guide.transportadora}
                            aplicaContrapago={guide.request.aplica_contrapago}
                            pdfUrl={pdfUrl}
                            pdfEndpoint={guide.response.pdf_endpoint}
                            variant="primary"
                        />
                    </div>

                    {pdfError && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-200">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                            <div>
                                <p className="font-semibold">La guía existe, pero el PDF no se generó correctamente.</p>
                                <p className="mt-1">{pdfError}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E6BFF] to-blue-700 text-white">
                                    <Package className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Resumen del envío</h2>
                            </div>
                            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                    <dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Transportadora</dt>
                                    <dd className="mt-1 font-semibold text-gray-900 dark:text-white">{carrierLabel(guide.transportadora)}</dd>
                                </div>
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                    <dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Valor declarado</dt>
                                    <dd className="mt-1 font-semibold text-green-600 dark:text-green-400">{formatCOP(guide.valor_declarado)}</dd>
                                </div>
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                    <dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Cotización</dt>
                                    <dd className="mt-1 truncate font-mono text-sm text-gray-800 dark:text-gray-200">{guide.cotizacion_id || '—'}</dd>
                                </div>
                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                    <dt className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Última actualización</dt>
                                    <dd className="mt-1 font-semibold text-gray-900 dark:text-white">{formatDateTime(guide.fecha_actualizacion)}</dd>
                                </div>
                            </dl>
                            {guide.response.mensaje && (
                                <p className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
                                    {guide.response.mensaje}
                                </p>
                            )}
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                                    <User className="h-5 w-5" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Destinatario</h2>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{recipient.nombre || 'Destinatario sin nombre'}</p>
                                    {(recipient.tipo_documento || recipient.numero_documento) && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {recipient.tipo_documento} {recipient.numero_documento}
                                            {recipient.dv ? `-${recipient.dv}` : ''}
                                        </p>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {[recipient.telefono, recipient.correo].filter(Boolean).join(' · ') || 'Sin datos de contacto'}
                                </p>
                                <div className="flex items-start gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:border-white/10 dark:bg-black/20 dark:text-gray-200">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                    <span>
                                        {recipient.direccion || 'Dirección no disponible'}
                                        {recipient.id_localidad && ` · DANE ${recipient.id_localidad}`}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                            <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">Paquete</h2>
                            <dl className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                    <dt className="text-gray-500 dark:text-gray-400">Contenido</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-white">{guide.request.contenido}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 dark:text-gray-400">Peso real</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                                        {isSynced ? 'No disponible' : formatWeight(guide.request.peso_kg)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 dark:text-gray-400">Dimensiones</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                                        {isSynced
                                            ? 'No disponible'
                                            : `${guide.request.largo_cm} × ${guide.request.ancho_cm} × ${guide.request.alto_cm} cm`}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 dark:text-gray-400">Contrapago</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                                        {guide.request.aplica_contrapago ? 'Sí' : 'No'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 dark:text-gray-400">Seguro</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-white">
                                        {guide.request.seguro99 ? 'Seguro 99' : guide.request.seguro99plus ? 'Seguro 99 Plus' : 'Sin seguro adicional'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 dark:text-gray-400">Fecha de creación</dt>
                                    <dd className="mt-1 font-medium text-gray-900 dark:text-white">{formatDate(guide.fecha_creacion)}</dd>
                                </div>
                            </dl>
                            {guide.request.observaciones && (
                                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                                    <span className="font-semibold text-gray-900 dark:text-white">Observaciones: </span>
                                    {guide.request.observaciones}
                                </p>
                            )}
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                            <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">Eventos</h2>
                            {guide.eventos.length === 0 ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No hay eventos registrados.</p>
                            ) : (
                                <ol className="space-y-4">
                                    {guide.eventos.map((event, index) => (
                                        <li key={event.id_evento} className="flex gap-3">
                                            <div className="flex flex-col items-center">
                                                <span className="mt-1 h-3 w-3 rounded-full bg-[#1E6BFF]" />
                                                {index < guide.eventos.length - 1 && (
                                                    <span className="mt-1 h-full w-px bg-gray-200 dark:bg-white/10" />
                                                )}
                                            </div>
                                            <div className="pb-2">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    {event.estado}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDateTime(event.fecha_creacion)}
                                                </p>
                                                {event.detalle && (
                                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{event.detalle}</p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuideDetailPage;
