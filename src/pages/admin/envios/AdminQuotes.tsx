import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Eye, FileText, Plus, RefreshCw, Search } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import QuoteStatusBadge from '../../../components/envios/QuoteStatusBadge';
import Alert from '../../../components/ui/Alert';
import Button from '../../../components/ui/Button';
import { buttonClass } from '../../../components/ui/buttonStyles';
import { Card } from '../../../components/ui/Card';
import DataTable from '../../../components/ui/DataTable';
import EmptyState from '../../../components/ui/EmptyState';
import { Input, Select } from '../../../components/ui/Field';
import PageHeader from '../../../components/ui/PageHeader';
import Pagination from '../../../components/ui/Pagination';
import { useClients } from '../../../hooks/useClients';
import { useQuoteHistory } from '../../../hooks/useQuoteHistory';
import { carrierLabel, formatCOP, formatDate } from '../../../utils/envios';
import type { QuoteHistoryItem, QuoteState } from '../../../types';

const AdminQuotes = () => {
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
    } = useQuoteHistory();
    const { clients } = useClients();
    const [codigoInput, setCodigoInput] = useState(filters.codigoDestino);

    const columns = useMemo<ColumnDef<QuoteHistoryItem, unknown>[]>(
        () => [
            {
                accessorKey: 'id_cotizacion',
                header: 'ID',
                meta: { className: 'hidden lg:table-cell' },
                cell: (info) => (
                    <span className="font-mono text-xs text-slate-400">
                        #{info.getValue() as number}
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
                accessorKey: 'codigo_destino',
                header: 'Destino DANE',
                meta: { className: 'hidden md:table-cell' },
                cell: (info) => (
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
                        {info.getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: 'valor_producto',
                header: 'Producto',
                meta: { className: 'hidden lg:table-cell' },
                cell: (info) => (
                    <span className="text-sm tabular-nums text-slate-600 dark:text-slate-300">
                        {formatCOP(info.getValue() as number)}
                    </span>
                ),
            },
            {
                accessorKey: 'total',
                header: 'Total',
                cell: (info) => (
                    <div>
                        <span className="text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
                            {formatCOP(info.getValue() as number)}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500 sm:hidden dark:text-slate-400">
                            {carrierLabel(info.row.original.transportadora)}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'estado',
                header: 'Estado',
                cell: (info) => (
                    <QuoteStatusBadge estado={info.getValue() as QuoteState} />
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
                cell: (info) => (
                    <div className="flex justify-end">
                        <Link
                            to={`/admin/envios/cotizaciones/${info.row.original.id_cotizacion}`}
                            title="Ver detalle"
                            aria-label={`Ver cotización ${info.row.original.id_cotizacion}`}
                            className={buttonClass('secondary', 'sm', 'h-9 w-9 px-0')}
                        >
                            <Eye className="h-4 w-4" />
                        </Link>
                    </div>
                ),
            },
        ],
        [],
    );

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateFilters({ codigoDestino: codigoInput.trim() });
    };

    const handleReset = () => {
        setCodigoInput('');
        updateFilters({ estado: '', codigoDestino: '', idCliente: '' });
    };

    return (
        <div className="page-shell">
            <div className="page-container">
                <PageHeader
                    backTo="/admin/envios"
                    backLabel="Volver a Envíos"
                    title="Historial de cotizaciones"
                    description="Tarifas guardadas, transportadora seleccionada y estado de uso de cada cotización."
                    actions={(
                        <Link to="/admin/envios/nueva" className={buttonClass('primary')}>
                            <Plus className="h-4 w-4" />
                            Nueva guía
                        </Link>
                    )}
                />

                {error && (
                    <div className="mb-6">
                        <Alert
                            tone="error"
                            title="No fue posible cargar las cotizaciones"
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

                <Card className="mb-6 p-4">
                    <form
                        onSubmit={handleSearch}
                        className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
                    >
                        <div className="relative">
                            <Search
                                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                aria-hidden="true"
                            />
                            <Input
                                value={codigoInput}
                                onChange={(event) => setCodigoInput(event.target.value)}
                                placeholder="Buscar por código DANE de destino"
                                aria-label="Buscar por código DANE de destino"
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={filters.estado}
                            onChange={(event) => updateFilters({
                                estado: event.target.value as QuoteState | '',
                            })}
                            aria-label="Filtrar por estado"
                        >
                            <option value="">Todos los estados</option>
                            <option value="seleccionada">Seleccionada</option>
                            <option value="usada">Usada</option>
                            <option value="anulada">Anulada</option>
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
                                itemLabel="cotizaciones"
                                onPageChange={setPageIndex}
                                onPageSizeChange={changePageSize}
                            />
                        )}
                        emptyState={(
                            <EmptyState
                                icon={<FileText className="h-6 w-6" />}
                                title="Aún no hay cotizaciones"
                                description="Cotiza un envío para comparar transportadoras y guardar la tarifa."
                                action={(
                                    <Link to="/admin/envios/nueva" className={buttonClass('primary')}>
                                        <Plus className="h-4 w-4" />
                                        Cotizar envío
                                    </Link>
                                )}
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminQuotes;
