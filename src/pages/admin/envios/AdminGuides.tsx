import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft,
    Eye,
    Loader2,
    Plus,
    RefreshCw,
    Search,
} from 'lucide-react';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    type ColumnDef,
} from '@tanstack/react-table';

import GuidePdfButton from '../../../components/envios/GuidePdfButton';
import GuideStatusBadge from '../../../components/envios/GuideStatusBadge';
import HistoryPagination from '../../../components/envios/HistoryPagination';
import { useGuideHistory } from '../../../hooks/useGuideHistory';
import {
    carrierLabel,
    formatCOP,
    formatDate,
} from '../../../utils/envios';
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
    } = useGuideHistory();
    const [numeroInput, setNumeroInput] = useState(filters.numeroGuia);

    const columns = useMemo<ColumnDef<GuideHistoryItem>[]>(
        () => [
            {
                accessorKey: 'id_guia',
                header: 'ID',
                cell: (info) => (
                    <span className="font-mono text-sm text-gray-500 dark:text-gray-400">
                        #{info.getValue() as number}
                    </span>
                ),
            },
            {
                accessorKey: 'numero_guia',
                header: 'Número de guía',
                cell: (info) => (
                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                        {info.getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: 'transportadora',
                header: 'Transportadora',
                cell: (info) => (
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                        {carrierLabel(info.getValue() as string)}
                    </span>
                ),
            },
            {
                accessorKey: 'valor_declarado',
                header: 'Valor declarado',
                cell: (info) => (
                    <span className="font-semibold text-green-600 dark:text-green-400">
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
                cell: (info) => (
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(info.getValue() as string)}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: 'Acciones',
                cell: (info) => {
                    const guide = info.row.original;
                    return (
                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                to={`/admin/envios/guias/${guide.id_guia}`}
                                title="Ver detalle"
                                aria-label={`Ver guía ${guide.numero_guia}`}
                                className="rounded-lg border border-purple-500/30 bg-purple-600/20 p-2 text-purple-500 transition-all hover:border-purple-500/50 hover:bg-purple-600/30"
                            >
                                <Eye className="h-4 w-4" />
                            </Link>
                            {guide.pdf_url && (
                                <GuidePdfButton
                                    numeroGuia={guide.numero_guia}
                                    transportadora={guide.transportadora}
                                    pdfUrl={guide.pdf_url}
                                    label="PDF"
                                />
                            )}
                        </div>
                    );
                },
            },
        ],
        [],
    );

    const table = useReactTable({
        data: items,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        updateFilters({ numeroGuia: numeroInput.trim() });
    };

    const handleReset = () => {
        setNumeroInput('');
        updateFilters({ estado: '', transportadora: '', numeroGuia: '' });
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="mb-8">
                    <Link
                        to="/admin/envios"
                        className="mb-4 inline-flex items-center gap-2 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a Envíos
                    </Link>
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Historial de guías
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                Incluye las guías creadas aquí y las generadas directamente en 99envíos.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={() => void refresh()}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
                            >
                                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                Actualizar
                            </button>
                            <Link
                                to="/admin/envios/nueva"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1E6BFF] to-blue-700 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/30 transition-all hover:from-blue-600 hover:to-blue-800"
                            >
                                <Plus className="h-4 w-4" />
                                Nueva guía
                            </Link>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300 sm:flex-row sm:items-center sm:justify-between">
                        <span>{error}</span>
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

                <form
                    onSubmit={handleSearch}
                    className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5 md:grid-cols-[1fr_auto_auto_auto]"
                >
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={numeroInput}
                            onChange={(event) => setNumeroInput(event.target.value)}
                            placeholder="Buscar por número de guía..."
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pl-12 text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#1E6BFF] dark:focus:ring-[#1E6BFF]"
                        />
                    </div>
                    <select
                        value={filters.estado}
                        onChange={(event) => updateFilters({
                            estado: event.target.value as GuideState | '',
                        })}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF]"
                    >
                        <option value="">Todos los estados</option>
                        <option value="creada">Creada</option>
                        <option value="pdf_generado">PDF generado</option>
                        <option value="pdf_error">PDF con error</option>
                        <option value="cancelada">Cancelada</option>
                    </select>
                    <select
                        value={filters.transportadora}
                        onChange={(event) => updateFilters({
                            transportadora: event.target.value as EnviosCarrier | '',
                        })}
                        className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-black/20 dark:text-white dark:focus:border-[#1E6BFF]"
                    >
                        <option value="">Todas las transportadoras</option>
                        <option value="interrapidisimo">Interrapidísimo</option>
                        <option value="tcc">TCC</option>
                        <option value="servientrega">Servientrega</option>
                        <option value="coordinadora">Coordinadora</option>
                        <option value="envia">Envía</option>
                    </select>
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            Buscar
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-600 transition-colors hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
                        >
                            Limpiar
                        </button>
                    </div>
                </form>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-12 w-12 animate-spin text-[#1E6BFF]" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-lg text-gray-500 dark:text-gray-400">
                                No hay guías guardadas ni registradas en 99envíos.
                            </p>
                            <Link
                                to="/admin/envios/nueva"
                                className="mt-4 inline-block font-semibold text-[#1E6BFF] hover:text-blue-500"
                            >
                                Crear la primera guía →
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr
                                                key={headerGroup.id}
                                                className="border-b border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5"
                                            >
                                                {headerGroup.headers.map((header) => (
                                                    <th
                                                        key={header.id}
                                                        className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300"
                                                    >
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext(),
                                                            )}
                                                    </th>
                                                ))}
                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody>
                                        {table.getRowModel().rows.map((row) => (
                                            <tr
                                                key={row.id}
                                                className="border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-white/5 dark:hover:bg-white/5"
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <td key={cell.id} className="px-6 py-4">
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <HistoryPagination
                                pageIndex={pageIndex}
                                pageSize={pageSize}
                                total={total}
                                itemLabel="guías"
                                onPageChange={setPageIndex}
                                onPageSizeChange={changePageSize}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminGuides;
