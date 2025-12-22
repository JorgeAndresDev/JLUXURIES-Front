import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from "@tanstack/react-table";
import { useAuditLogs } from "../../../hooks/useAuditLogs";
import type { AuditLog } from "../../../types";

const AuditLogs = () => {
    const { auditLogs, loading, error } = useAuditLogs();
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);

    // Define columns
    const columns = useMemo<ColumnDef<AuditLog>[]>(
        () => [
            {
                accessorKey: "id_log",
                header: "ID",
                cell: (info) => (
                    <span className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                        #{info.getValue() as number}
                    </span>
                ),
            },
            {
                accessorKey: "user_id",
                header: "Usuario ID",
                cell: (info) => (
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {info.getValue() as number}
                    </span>
                ),
            },
            {
                accessorKey: "user_name",
                header: "Nombre",
                cell: (info) => {
                    const name = info.getValue() as string;
                    return (
                        <span className="text-gray-900 dark:text-white font-semibold">
                            {name || 'N/A'}
                        </span>
                    );
                },
            },
            {
                accessorKey: "user_email",
                header: "Email",
                cell: (info) => (
                    <span className="text-gray-600 dark:text-gray-300 text-sm">
                        {info.getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: "action",
                header: "Acción",
                cell: (info) => {
                    const action = info.getValue() as string;
                    const colorClass =
                        action.toLowerCase().includes('create') || action.toLowerCase().includes('crear') ? 'text-green-600 dark:text-green-400' :
                            action.toLowerCase().includes('update') || action.toLowerCase().includes('actualizar') ? 'text-blue-600 dark:text-blue-400' :
                                action.toLowerCase().includes('delete') || action.toLowerCase().includes('eliminar') ? 'text-red-600 dark:text-red-400' :
                                    'text-yellow-600 dark:text-yellow-400';

                    return (
                        <span className={`font-semibold ${colorClass}`}>
                            {action}
                        </span>
                    );
                },
            },
            {
                accessorKey: "details",
                header: "Detalles",
                cell: (info) => {
                    const details = info.getValue() as string;
                    return (
                        <span className="text-gray-600 dark:text-gray-300 text-sm truncate max-w-xs block">
                            {details || '-'}
                        </span>
                    );
                },
            },
            {
                accessorKey: "ip_address",
                header: "IP",
                cell: (info) => (
                    <span className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                        {(info.getValue() as string) || '-'}
                    </span>
                ),
            },
            {
                accessorKey: "timestamp",
                header: "Fecha",
                cell: (info) => {
                    const date = new Date(info.getValue() as string);
                    return (
                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                            {date.toLocaleString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    );
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data: auditLogs,
        columns,
        state: {
            globalFilter,
            sorting,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 5,
            },
        },
    });

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <div className="container mx-auto px-4 pt-24 pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Historial de Auditoría
                    </h1>
                    <Link
                        to="/admin"
                        className="px-6 py-3 border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white rounded-xl font-semibold transition-all"
                    >
                        Volver al Dashboard
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            placeholder="Buscar por acción, usuario, detalles..."
                            className="w-full px-5 py-4 pl-12 bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-[#1E6BFF]/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all shadow-sm dark:shadow-none"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl dark:shadow-none">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-[#1E6BFF]"></div>
                        </div>
                    ) : auditLogs.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 dark:text-gray-400 text-lg">No hay registros de auditoría</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <tr
                                                key={headerGroup.id}
                                                className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5"
                                            >
                                                {headerGroup.headers.map((header) => (
                                                    <th
                                                        key={header.id}
                                                        className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                                                    >
                                                        {header.isPlaceholder ? null : (
                                                            <div
                                                                className={
                                                                    header.column.getCanSort()
                                                                        ? "cursor-pointer select-none flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors"
                                                                        : ""
                                                                }
                                                                onClick={header.column.getToggleSortingHandler()}
                                                            >
                                                                {flexRender(
                                                                    header.column.columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                                {header.column.getCanSort() && (
                                                                    <span className="text-gray-400 dark:text-gray-500">
                                                                        {{
                                                                            asc: "↑",
                                                                            desc: "↓",
                                                                        }[header.column.getIsSorted() as string] ?? "↕"}
                                                                    </span>
                                                                )}
                                                            </div>
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
                                                className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <td key={cell.id} className="px-6 py-4">
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{" "}
                                    {Math.min(
                                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                        table.getFilteredRowModel().rows.length
                                    )}{" "}
                                    de {table.getFilteredRowModel().rows.length} registros
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 dark:text-gray-400">Mostrar</span>

                                    <select
                                        value={table.getState().pagination.pageSize}
                                        onChange={(e) => table.setPageSize(Number(e.target.value))}
                                        className="px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-white/10 transition-all outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-500/50"
                                    >
                                        <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-purple-300" value={5}>5</option>
                                        <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-purple-300" value={10}>10</option>
                                        <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-purple-300" value={20}>20</option>
                                        <option className="bg-white dark:bg-gray-900 text-gray-900 dark:text-purple-300" value={50}>50</option>
                                    </select>

                                    <button
                                        onClick={() => table.setPageIndex(0)}
                                        disabled={!table.getCanPreviousPage()}
                                        className="px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-all font-medium"
                                    >
                                        {"<<"}
                                    </button>
                                    <button
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                        className="px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-all font-medium"
                                    >
                                        {"<"}
                                    </button>
                                    <span className="px-4 py-2 text-gray-700 dark:text-white font-medium">
                                        Página {table.getState().pagination.pageIndex + 1} de{" "}
                                        {table.getPageCount()}
                                    </span>
                                    <button
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                        className="px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-all font-medium"
                                    >
                                        {">"}
                                    </button>
                                    <button
                                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                        disabled={!table.getCanNextPage()}
                                        className="px-3 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/10 transition-all font-medium"
                                    >
                                        {">>"}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>

    );
};

export default AuditLogs;
