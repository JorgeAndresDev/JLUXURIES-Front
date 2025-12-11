import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash } from "lucide-react";
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
import { useClients } from "../../../hooks/useClients";
import type { Client } from "../../../types";

const AdminClients = () => {
    const navigate = useNavigate();
    const { clients, loading, deleteClient } = useClients();
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<SortingState>([]);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const handleDelete = async (id: number) => {
        const success = await deleteClient(id);
        if (success) {
            setDeleteConfirm(null);
            setToast({ message: '¡Cliente eliminado exitosamente!', type: 'success' });
            setTimeout(() => setToast(null), 3000);
        } else {
            setToast({ message: 'Error al eliminar el cliente', type: 'error' });
            setTimeout(() => setToast(null), 3000);
        }
    };

    // Define columns
    const columns = useMemo<ColumnDef<Client>[]>(
        () => [
            {
                accessorKey: "id_cliente",
                header: "ID",
                cell: (info) => (
                    <span className="text-gray-400 font-mono text-sm">
                        #{info.getValue() as number}
                    </span>
                ),
            },
            {
                accessorKey: "nombre",
                header: "Nombre",
                cell: (info) => (
                    <span className="font-semibold text-white">
                        {info.getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: "email",
                header: "Email",
                cell: (info) => (
                    <span className="text-gray-300">
                        {info.getValue() as string}
                    </span>
                ),
            },
            {
                accessorKey: "telefono",
                header: "Teléfono",
                cell: (info) => (
                    <span className="text-gray-300">
                        {(info.getValue() as string) || "N/A"}
                    </span>
                ),
            },
            {
                accessorKey: "role",
                header: "Rol",
                cell: (info) => (
                    <span className={`truncate max-w-xs block font-medium ${(info.getValue() as string) === 'admin' ? 'text-purple-400' : 'text-gray-300'
                        }`}>
                        {(info.getValue() as string) === 'admin' ? 'Admin' : 'Cliente'}
                    </span>
                ),
            },
            {
                id: "actions",
                header: "Acciones",
                cell: (info) => (
                    <div className="flex gap-2">
                        {/* Ver */}
                        <button
                            onClick={() =>
                                navigate(`/admin/client/${info.row.original.id_cliente}`)
                            }
                            className="p-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-all border border-purple-500/30 hover:border-purple-500/50"
                        >
                            <Eye className="size-4" />
                        </button>

                        {/* Editar */}
                        <button
                            onClick={() =>
                                navigate(`/admin/edit-client/${info.row.original.id_cliente}`)
                            }
                            className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-all border border-blue-500/30 hover:border-blue-500/50"
                        >
                            <Pencil className="size-4" />
                        </button>

                        {/* Eliminar */}
                        <button
                            onClick={() => setDeleteConfirm(info.row.original.id_cliente!)}
                            className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-all border border-red-500/30 hover:border-red-500/50"
                        >
                            <Trash className="size-4" />
                        </button>
                    </div>
                ),
            },
        ],
        [navigate]
    );

    const table = useReactTable({
        data: clients,
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
        <div className="container mx-auto px-4 pt-24 pb-12">
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-20 right-4 z-50 animate-[slideIn_0.3s_ease-out]">
                    <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm border ${toast.type === 'success'
                        ? 'bg-green-600/90 border-green-400/50 text-white'
                        : 'bg-red-600/90 border-red-400/50 text-white'
                        }`}>
                        <svg className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">{toast.message}</span>
                        <button
                            onClick={() => setToast(null)}
                            className="ml-2 hover:opacity-80 transition-opacity"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <h1 className="text-4xl font-bold text-white tracking-tight">
                    Administrar Clientes
                </h1>
                <div className="flex gap-3">
                    <Link
                        to="/admin"
                        className="px-6 py-3 border border-white/10 hover:bg-white/5 text-white rounded-xl font-semibold transition-all"
                    >
                        ← Dashboard
                    </Link>
                    <button
                        onClick={() => navigate("/admin/create-client")}
                        className="px-6 py-3 bg-blue-600/30 border border-blue-500/50 rounded-xl text-white font-semibold hover:shadow-[0_0_20px_#1E6BFF] transition backdrop-blur-md"
                    >
                        Registrar nuevo cliente
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Buscar clientes por nombre, email, teléfono..."
                        className="w-full px-5 py-4 pl-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:border-[#1E6BFF] focus:ring-2 focus:ring-[#1E6BFF]/50 text-white placeholder-gray-500 transition-all"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
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

            {/* Table */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E6BFF]"></div>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No hay clientes registrados</p>
                        <Link
                            to="/admin/create-client"
                            className="inline-block mt-4 text-[#1E6BFF] hover:text-blue-400 font-semibold"
                        >
                            Crear el primero →
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
                                            className="border-b border-white/10 bg-white/5"
                                        >
                                            {headerGroup.headers.map((header) => (
                                                <th
                                                    key={header.id}
                                                    className="px-6 py-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider"
                                                >
                                                    {header.isPlaceholder ? null : (
                                                        <div
                                                            className={
                                                                header.column.getCanSort()
                                                                    ? "cursor-pointer select-none flex items-center gap-2 hover:text-white transition-colors"
                                                                    : ""
                                                            }
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            {flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                            {header.column.getCanSort() && (
                                                                <span className="text-gray-500">
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
                                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
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
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 bg-white/5 border-t border-white/10">
                            <div className="text-sm text-gray-400">
                                Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{" "}
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                    table.getFilteredRowModel().rows.length
                                )}{" "}
                                de {table.getFilteredRowModel().rows.length} clientes
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-400">Mostrar</span>

                                <select
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => table.setPageSize(Number(e.target.value))}
                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                                >
                                    <option className="bg-gray-900 text-purple-300" value={5}>5</option>
                                    <option className="bg-gray-900 text-purple-300" value={10}>10</option>
                                    <option className="bg-gray-900 text-purple-300" value={20}>20</option>
                                    <option className="bg-gray-900 text-purple-300" value={50}>50</option>
                                </select>

                                <button
                                    onClick={() => table.setPageIndex(0)}
                                    disabled={!table.getCanPreviousPage()}
                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                                >
                                    {"<<"}
                                </button>
                                <button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                                >
                                    {"<"}
                                </button>
                                <span className="px-4 py-2 text-white">
                                    Página {table.getState().pagination.pageIndex + 1} de{" "}
                                    {table.getPageCount()}
                                </span>
                                <button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                                >
                                    {">"}
                                </button>
                                <button
                                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                    disabled={!table.getCanNextPage()}
                                    className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                                >
                                    {">>"}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm !== null && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            ¿Eliminar cliente?
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Esta acción no se puede deshacer. El cliente será eliminado
                            permanentemente.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 py-3 px-4 border border-white/10 hover:bg-white/5 text-white rounded-xl font-semibold transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/30"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminClients;
