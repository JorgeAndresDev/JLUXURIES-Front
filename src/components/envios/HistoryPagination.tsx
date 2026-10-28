interface HistoryPaginationProps {
    pageIndex: number;
    pageSize: number;
    total: number;
    itemLabel: string;
    onPageChange: (pageIndex: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

const HistoryPagination = ({
    pageIndex,
    pageSize,
    total,
    itemLabel,
    onPageChange,
    onPageSizeChange,
}: HistoryPaginationProps) => {
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const start = total === 0 ? 0 : pageIndex * pageSize + 1;
    const end = Math.min((pageIndex + 1) * pageSize, total);

    return (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-white/10 dark:bg-white/5 md:flex-row">
            <div className="text-sm text-gray-500 dark:text-gray-400">
                Mostrando {start} a {end} de {total} {itemLabel}
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Mostrar</span>
                <select
                    value={pageSize}
                    onChange={(event) => onPageSizeChange(Number(event.target.value))}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 outline-none transition-all hover:bg-gray-50 focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                    <option className="bg-white text-gray-900 dark:bg-gray-900 dark:text-purple-300" value={5}>5</option>
                    <option className="bg-white text-gray-900 dark:bg-gray-900 dark:text-purple-300" value={10}>10</option>
                    <option className="bg-white text-gray-900 dark:bg-gray-900 dark:text-purple-300" value={20}>20</option>
                    <option className="bg-white text-gray-900 dark:bg-gray-900 dark:text-purple-300" value={50}>50</option>
                </select>
                <button
                    type="button"
                    onClick={() => onPageChange(0)}
                    disabled={pageIndex === 0}
                    aria-label="Primera página"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-medium text-gray-700 transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                    {'<<'}
                </button>
                <button
                    type="button"
                    onClick={() => onPageChange(pageIndex - 1)}
                    disabled={pageIndex === 0}
                    aria-label="Página anterior"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-medium text-gray-700 transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                    {'<'}
                </button>
                <span className="px-4 py-2 font-medium text-gray-700 dark:text-white">
                    Página {pageIndex + 1} de {pageCount}
                </span>
                <button
                    type="button"
                    onClick={() => onPageChange(pageIndex + 1)}
                    disabled={pageIndex >= pageCount - 1}
                    aria-label="Página siguiente"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-medium text-gray-700 transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                    {'>'}
                </button>
                <button
                    type="button"
                    onClick={() => onPageChange(pageCount - 1)}
                    disabled={pageIndex >= pageCount - 1}
                    aria-label="Última página"
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-medium text-gray-700 transition-all hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                    {'>>'}
                </button>
            </div>
        </div>
    );
};

export default HistoryPagination;
