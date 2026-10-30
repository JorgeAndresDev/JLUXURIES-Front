import type { ReactNode } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type Column,
  type ColumnDef,
} from '@tanstack/react-table';

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  loading?: boolean;
  emptyState?: ReactNode;
  footer?: ReactNode;
  minWidthClass?: string;
}

const columnClassName = <TData,>(column: Column<TData, unknown>): string =>
  (column.columnDef.meta as { className?: string } | undefined)?.className ?? '';

const DataTable = <TData,>({
  data,
  columns,
  loading = false,
  emptyState,
  footer,
  minWidthClass = 'min-w-[760px]',
}: DataTableProps<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="divide-y divide-slate-100 dark:divide-white/5" aria-busy="true">
        <div className="flex gap-4 bg-slate-50 px-5 py-3 dark:bg-white/[0.03]">
          {columns.slice(0, 5).map((_, index) => (
            <div key={index} className="skeleton h-3 flex-1" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 px-5 py-4">
            {columns.slice(0, 5).map((_, cellIndex) => (
              <div key={cellIndex} className="skeleton h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!data.length) {
    return <>{emptyState}</>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className={`table-base ${minWidthClass}`}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={`th ${columnClassName(header.column)}`}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.03]"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={`td ${columnClassName(cell.column)}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer}
    </>
  );
};

export default DataTable;
