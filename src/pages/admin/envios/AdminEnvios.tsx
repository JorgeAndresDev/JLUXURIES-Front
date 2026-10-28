import { Link } from 'react-router-dom';
import {
    AlertTriangle,
    ArrowLeft,
    Building2,
    CheckCircle2,
    FileText,
    ListChecks,
    Loader2,
    MapPin,
    RefreshCw,
    Truck,
} from 'lucide-react';

import { useEnviosStatus } from '../../../hooks/useEnviosStatus';
import { formatDuration } from '../../../utils/envios';

const AdminEnvios = () => {
    const {
        status,
        branch,
        loading,
        error,
        refresh,
    } = useEnviosStatus();

    return (
        <div className="min-h-screen w-full bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <Link
                            to="/admin"
                            className="mb-4 inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al Dashboard
                        </Link>
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Centro de Envíos
                        </h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                            Cotiza, genera guías y consulta el historial de 99envíos.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300 sm:flex-row sm:items-center sm:justify-between">
                            <span className="inline-flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 shrink-0" />
                                {error}
                            </span>
                            <button
                                type="button"
                                onClick={() => void refresh()}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 px-3 py-2 font-semibold transition-colors hover:bg-red-100 dark:border-red-500/40 dark:hover:bg-red-500/20"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Reintentar
                            </button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                            <div className="mb-5 flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 shadow-lg">
                                    <Truck className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Integración 99envíos
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Estado de la conexión
                                    </p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex items-center gap-2 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Consultando estado...
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-black/20">
                                        <span className="text-sm text-gray-600 dark:text-gray-300">Conexión</span>
                                        <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${status?.authenticated
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                            }`}>
                                            <CheckCircle2 className="h-4 w-4" />
                                            {status?.authenticated ? 'Autenticada' : 'No disponible'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Proveedor</p>
                                            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                                                {status?.provider ?? '99envíos'}
                                            </p>
                                        </div>
                                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-black/20">
                                            <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Token</p>
                                            <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                                                {status ? formatDuration(status.expires_in_seconds) : '—'}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => void refresh()}
                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                        Actualizar estado
                                    </button>
                                </div>
                            )}
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                            <div className="mb-5 flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg">
                                    <Building2 className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Sucursal de origen
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Datos configurados en 99envíos
                                    </p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex items-center gap-2 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Consultando sucursal...
                                </div>
                            ) : branch ? (
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{branch.nombre_sucursal}</p>
                                        <p className="font-mono text-sm text-gray-500 dark:text-gray-400">{branch.codigo_sucursal}</p>
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                                        <span>{branch.direccion}, {branch.ciudad_origen}</span>
                                    </div>
                                    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-black/20">
                                        <span className="text-gray-500 dark:text-gray-400">Teléfono: </span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{branch.telefono}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="py-4 text-sm text-gray-500 dark:text-gray-400">
                                    No fue posible cargar la sucursal de origen.
                                </p>
                            )}
                        </section>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <Link
                            to="/admin/envios/nueva"
                            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-xl backdrop-blur-sm transition-all hover:border-blue-500 hover:shadow-2xl dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:border-[#1E6BFF] dark:hover:shadow-[0_0_30px_#1E6BFF40]"
                        >
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#1E6BFF] to-blue-700 shadow-lg">
                                <Truck className="h-7 w-7 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nueva guía</h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Cotiza el envío, registra el destinatario y genera la guía.
                            </p>
                            <span className="mt-4 inline-block text-sm font-semibold text-[#1E6BFF]">
                                Crear envío →
                            </span>
                        </Link>

                        <Link
                            to="/admin/envios/guias"
                            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-xl backdrop-blur-sm transition-all hover:border-green-500 hover:shadow-2xl dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:border-green-500 dark:hover:shadow-[0_0_30px_rgba(34,197,94,0.25)]"
                        >
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg">
                                <ListChecks className="h-7 w-7 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guías generadas</h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Consulta estados, destinatarios y descarga los PDF.
                            </p>
                            <span className="mt-4 inline-block text-sm font-semibold text-green-600 dark:text-green-400">
                                Ver historial →
                            </span>
                        </Link>

                        <Link
                            to="/admin/envios/cotizaciones"
                            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-xl backdrop-blur-sm transition-all hover:border-orange-500 hover:shadow-2xl dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:hover:border-orange-500 dark:hover:shadow-[0_0_30px_rgba(249,115,22,0.25)]"
                        >
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 shadow-lg">
                                <FileText className="h-7 w-7 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Cotizaciones</h2>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Revisa las cotizaciones guardadas y sus tarifas.
                            </p>
                            <span className="mt-4 inline-block text-sm font-semibold text-orange-600 dark:text-orange-400">
                                Ver historial →
                            </span>
                        </Link>
                    </div>

                    <div className="mt-6 flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 dark:border-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-200">
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                        <p>
                            La generación de una guía es una operación real y puede generar costos con la transportadora.
                            No reintentes automáticamente si la respuesta falla: revisa el historial antes de volver a intentar.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEnvios;
