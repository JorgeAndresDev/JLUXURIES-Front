import { Link } from 'react-router-dom';
import {
    AlertTriangle,
    ArrowRight,
    Building2,
    CheckCircle2,
    FileText,
    ListChecks,
    MapPin,
    Phone,
    RefreshCw,
    Truck,
    XCircle,
} from 'lucide-react';

import Alert from '../../../components/ui/Alert';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { buttonClass } from '../../../components/ui/buttonStyles';
import { Card, CardHeader, Tile } from '../../../components/ui/Card';
import PageHeader from '../../../components/ui/PageHeader';
import { useEnviosStatus } from '../../../hooks/useEnviosStatus';
import { formatDuration } from '../../../utils/envios';

const AdminEnvios = () => {
    const { status, branch, loading, error, refresh } = useEnviosStatus();

    const connectionLabel = status?.authenticated
        ? 'Conectada'
        : status
            ? 'Sin autenticar'
            : 'Sin verificar';

    return (
        <div className="page-shell">
            <div className="page-container">
                <PageHeader
                    backTo="/admin"
                    backLabel="Volver al Dashboard"
                    title="Envíos"
                    description="Cotiza, genera guías y consulta el historial de 99envíos desde un solo lugar."
                    actions={(
                        <>
                            <Button
                                variant="secondary"
                                loading={loading}
                                icon={<RefreshCw className="h-4 w-4" />}
                                onClick={() => void refresh()}
                            >
                                Actualizar estado
                            </Button>
                            <Link to="/admin/envios/nueva" className={buttonClass('primary')}>
                                <Truck className="h-4 w-4" />
                                Nueva guía
                            </Link>
                        </>
                    )}
                />

                {error && (
                    <div className="mb-6">
                        <Alert
                            tone="error"
                            title="No fue posible consultar la integración"
                            action={(
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={<RefreshCw className="h-4 w-4" />}
                                    onClick={() => void refresh()}
                                >
                                    Reintentar
                                </Button>
                            )}
                        >
                            {error}
                        </Alert>
                    </div>
                )}

                {status && !status.configured && (
                    <div className="mb-6">
                        <Alert tone="warning" title="Integración no configurada">
                            Configura las credenciales de 99envíos en el servidor para habilitar cotizaciones y guías.
                        </Alert>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <Card className="p-5">
                        <CardHeader
                            icon={<Truck className="h-5 w-5" />}
                            title="Conexión 99envíos"
                            description="Estado de la cuenta y vigencia de la sesión"
                            action={(
                                <Badge tone={status?.authenticated ? 'success' : status ? 'warning' : 'neutral'}>
                                    {connectionLabel}
                                </Badge>
                            )}
                        />

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Tile className="p-4">
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Proveedor
                                </p>
                                <p className="mt-1.5 text-base font-semibold text-slate-900 dark:text-white">
                                    {status?.provider ?? '99envíos'}
                                </p>
                            </Tile>
                            <Tile className="p-4">
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Sesión
                                </p>
                                <p className="mt-1.5 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                                    {status?.authenticated ? (
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <XCircle className="h-4 w-4 text-slate-400" />
                                    )}
                                    {status ? formatDuration(status.expires_in_seconds) : '—'}
                                </p>
                            </Tile>
                        </div>
                    </Card>

                    <Card className="p-5">
                        <CardHeader
                            icon={<Building2 className="h-5 w-5" />}
                            title="Sucursal de origen"
                            description="Datos con los que se generan las guías"
                        />

                        {loading ? (
                            <div className="mt-5 space-y-3">
                                <div className="skeleton h-7 w-2/3" />
                                <div className="skeleton h-4 w-full" />
                                <div className="skeleton h-10 w-full" />
                            </div>
                        ) : branch ? (
                            <div className="mt-5 space-y-3">
                                <div>
                                    <p className="text-xl font-semibold text-slate-900 dark:text-white">
                                        {branch.nombre_sucursal}
                                    </p>
                                    <p className="mt-0.5 font-mono text-sm text-slate-500 dark:text-slate-400">
                                        {branch.codigo_sucursal}
                                    </p>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                                    <span>{branch.direccion}, {branch.ciudad_origen}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                                    <span>{branch.telefono}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
                                No fue posible cargar la sucursal de origen.
                            </p>
                        )}
                    </Card>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                    <Link
                        to="/admin/envios/nueva"
                        className="card group p-5 transition hover:border-brand-300 hover:shadow-lift dark:hover:border-brand-500/40"
                    >
                        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                            <Truck className="h-5 w-5" />
                        </span>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            Nueva guía
                        </h2>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            Cotiza, completa el destinatario y genera la guía.
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400">
                            Crear envío
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </Link>

                    <Link
                        to="/admin/envios/guias"
                        className="card group p-5 transition hover:border-brand-300 hover:shadow-lift dark:hover:border-brand-500/40"
                    >
                        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <ListChecks className="h-5 w-5" />
                        </span>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            Guías
                        </h2>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            Sincroniza 99envíos y descarga los PDF generados.
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400">
                            Ver historial
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </Link>

                    <Link
                        to="/admin/envios/cotizaciones"
                        className="card group p-5 transition hover:border-brand-300 hover:shadow-lift dark:hover:border-brand-500/40"
                    >
                        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                            <FileText className="h-5 w-5" />
                        </span>
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            Cotizaciones
                        </h2>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            Revisa tarifas guardadas y la transportadora elegida.
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400">
                            Ver tarifas
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                    </Link>
                </div>

                <div className="mt-5">
                    <Alert tone="warning" title="La creación de guías tiene costo">
                        Generar una guía es una operación real con la transportadora. Si la respuesta falla,
                        revisa el historial antes de volver a intentarlo.
                    </Alert>
                </div>

                <div className="mt-5 flex items-start gap-2 text-xs text-slate-400 dark:text-slate-500">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <p>
                        La sincronización del historial consulta 99envíos cada vez que abres la lista de guías.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminEnvios;
