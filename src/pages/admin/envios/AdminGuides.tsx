import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Plus, RefreshCw, Search, Truck } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import GuidePdfButton from '../../../components/envios/GuidePdfButton';
import GuideStatusBadge from '../../../components/envios/GuideStatusBadge';
import Alert from '../../../components/ui/Alert';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { buttonClass } from '../../../components/ui/buttonStyles';
import { Card } from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import EmptyState from '../../../components/ui/EmptyState';
import { Input, Select } from '../../../components/ui/Field';
import PageHeader from '../../../components/ui/PageHeader';
import Pagination from '../../../components/ui/Pagination';
import { useClients } from '../../../hooks/useClients';
import { useGuideHistory } from '../../../hooks/useGuideHistory';
import { carrierLabel, formatCOP, formatDate } from '../../../utils/envios';
import type {
    EnviosCarrier,
    GuideHistoryItem,
    GuideState,
} from '../../../types';

const AdminGuides = () => {
    const {
        items,
        total,
        loading,
        error,
        pageIndex,
        pageSize,
        setPageIndex,
        changePageSize,
        filters,
        updateFilters,
        refresh,
        lastSyncedAt,
    } = useGuideHistory();
    const { clients } = useClients();
    const [numeroInput, setNumeroInput] = useState(filters.numeroGuia);

    const columns = useMemo<ColumnDef<GuideHistoryItem, unknown>[]>(
        () => [
            {
                accessorKey: 'id_guia',
                header: 'ID',
                meta: { className: 'hidden lg:table-cell' },
                cell: (info) => (
                    <span className="font-mono text-xs text-slate-400">
                        #{info.getValue() as number}
                    </span>
                ),
            },
            {
                accessorKey: 'numero_guia',
                header: 'Guía',
                cell: (info) => (
                    <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                        {info.getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: 'transportadora',
                header: 'Transportadora',
                meta: { className: 'hidden sm:table-cell' },
                cell: (info) => (
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                        {carrierLabel(info.getValue() as string)}
                    </span>
                ),
            },
            {
                accessorKey: 'valor_declarado',
                header: 'Valor declarado',
                meta: { className: 'hidden lg:table-cell' },
                cell: (info) => (
                    <span className="text-sm font-medium tabular-nums text-slate-900 dark:text-white">
                        {formatCOP(info.getValue() as number)}
                    </span>
                ),
            },
            {
                accessorKey: 'estado',
                header: 'Estado',
                cell: (info) => (
                    <GuideStatusBadge estado={info.getValue() as GuideState} />
                ),
            },
            {
                accessorKey: 'fecha_creacion',
                header: 'Fecha',
                meta: { className: 'hidden md:table-cell' },
                cell: (info) => (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(info.getValue() as string)}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: '',
                cell: (info) => {
                    const guide = info.row.original;
                    return (
                        <div className="flex items-center justify-end gap-2">
                            <Link
                                to={`/admin/envios/guias/${guide.id_guia}`}
                                title="Ver detalle"
                                aria-label={`Ver guía ${guide.numero_guia}`}
                                className={buttonClass('secondary', 'sm', 'h-9 w-9 px-0')}
                            >
                                <Eye className="h-4 w-4" />
                            </Link>
                            {guide.pdf_url && (
                                <div className="hidden sm:block">
                                    <GuidePdfButton
                                        numeroGuia={guide.numero_guia}
                                        transportadora={guide.transportadora}
                                        pdfUrl={guide.pdf_url}
                                        label="PDF"
                                    />
                                </div>
                            )}
                        </div>
                    );
                },
            },
        ],
        [],
    );

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateFilters({ numeroGuia: numeroInput.trim() });
    };

    const handleReset = () => {
        setNumeroInput('');
        updateFilters({
            estado: '',
            transportadora: '',
            numeroGuia: '',
            idCliente: '',
        });
    };

    return (
        <div className="page-shell">
            <div className="page-container">
                <PageHeader
                    backTo="/admin/envios"
                    backLabel="Volver a Envíos"
                    title="Historial de guías"
                    description="Guías creadas en JLUXURIES y generadas directamente en 99envíos, sincronizadas en una sola vista."
                    actions={
                        <>
                            <Button
                                variant="secondary"
                                loading={loading}
                                icon={<RefreshCw className="h-4 w-4" />}
                                onClick={() => void refresh({ sync: true })}
                            >
                                {loading ? 'Sincronizando…' : 'Sincronizar 99envíos'}
                            </Button>
                            <Link to="/admin/envios/nueva" className={buttonClass('primary')}>
                                <Plus className="h-4 w-4" />
                                Nueva guía
                            </Link>
                        </>
                    }
                />

                {lastSyncedAt && !loading && (
                    <p className="-mt-5 mb-6 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                        <Truck className="h-3.5 w-3.5" />
                        Última sincronización: {lastSyncedAt.toLocaleTimeString('es-CO', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                )}

                {error && (
                    <div className="mb-6">
                        <Alert
                            tone="error"
                            title="No fue posible cargar las guías"
                            action={
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={<RefreshCw className="h-4 w-4" />}
                                    onClick={() => void refresh({ sync: false })}
                                >
                                    Reintentar
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    </div>
                )}

                <Card className="mb-6 p-4">
                    <form
                        onSubmit={handleSearch}
                        className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
                    >
                        <div className="relative">
                            <Search
                                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                aria-hidden="true"
                            />
                            <Input
                                value={numeroInput}
                                onChange={(event) => setNumeroInput(event.target.value)}
                                placeholder="Buscar por número de guía"
                                aria-label="Buscar por número de guía"
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={filters.estado}
                            onChange={(event) => updateFilters({
                                estado: event.target.value as GuideState | '',
                            })}
                            aria-label="Filtrar por estado"
                        >
                            <option value="">Todos los estados</option>
                            <option value="creada">Creada</option>
                            <option value="pdf_generado">PDF generado</option>
                            <option value="pdf_error">PDF con error</option>
                            <option value="cancelada">Cancelada</option>
                        </Select>
                        <Select
                            value={filters.transportadora}
                            onChange={(event) => updateFilters({
                                transportadora: event.target.value as EnviosCarrier | '',
                            })}
                            aria-label="Filtrar por transportadora"
                        >
                            <option value="">Todas las transportadoras</option>
                            <option value="interrapidisimo">Interrapidísimo</option>
                            <option value="tcc">TCC</option>
                            <option value="servientrega">Servientrega</option>
                            <option value="coordinadora">Coordinadora</option>
                            <option value="envia">Envía</option>
                        </Select>
                        <Select
                            value={filters.idCliente}
                            onChange={(event) => updateFilters({
                                idCliente: event.target.value ? Number(event.target.value) : '',
                            })}
                            aria-label="Filtrar por cliente"
                        >
                            <option value="">Todos los clientes</option>
                            {clients.map((client) => (
                                <option key={client.id_cliente} value={client.id_cliente}>
                                    {client.nombre} · {client.email}
                                </option>
                            ))}
                        </Select>
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1">Buscar</Button>
                            <Button type="button" variant="ghost" onClick={handleReset}>
                                Limpiar
                            </Button>
                        </div>
                    </form>
                </Card>

                <div className="table-shell">
                    <DataTable
                        data={items}
                        columns={columns}
                        loading={loading}
                        minWidthClass="min-w-full sm:min-w-[860px]"
                        footer={(
                            <Pagination
                                pageIndex={pageIndex}
                                pageSize={pageSize}
                                total={total}
                                itemLabel="guías"
                                onPageChange={setPageIndex}
                                onPageSizeChange={changePageSize}
                            />
                        )}
                        emptyState={(
                            <EmptyState
                                icon={<Truck className="h-6 w-6" />}
                                title="Aún no hay guías"
                                description="Crea una guía o sincroniza las que ya existen en 99envíos."
                                action={(
                                    <div className="flex flex-wrap justify-center gap-2">
                                        <Link to="/admin/envios/nueva" className={buttonClass('primary')}>
                                            <Plus className="h-4 w-4" />
                                            Nueva guía
                                        </Link>
                                        <Button
                                            variant="secondary"
                                            icon={<RefreshCw className="h-4 w-4" />}
                                            onClick={() => void refresh({ sync: true })}
                                        >
                                            Sincronizar
                                        </Button>
                                    </div>
                                )}
                            />
                        )}
                    />
                </div>

                {!loading && items.length > 0 && (
                    <p className="mt-4 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                        <Badge tone="neutral">99envíos</Badge>
                        La sincronización consulta el historial remoto antes de responder.
                    </p>
                )}
            </div>
        </div>
    );
};

export default AdminGuides;
