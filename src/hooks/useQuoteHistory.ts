import { useCallback, useEffect, useState } from 'react';

import { getQuoteHistory } from '../services/Envios';
import { getEnviosErrorMessage } from '../utils/envios';
import type { QuoteHistoryItem, QuoteState } from '../types';

export interface QuoteHistoryFilters {
    estado: QuoteState | '';
    codigoDestino: string;
}

const initialFilters: QuoteHistoryFilters = {
    estado: '',
    codigoDestino: '',
};

export const useQuoteHistory = () => {
    const [items, setItems] = useState<QuoteHistoryItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<QuoteHistoryFilters>(initialFilters);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getQuoteHistory({
                limit: pageSize,
                offset: pageIndex * pageSize,
                estado: filters.estado || undefined,
                codigo_destino: filters.codigoDestino.trim() || undefined,
            });
            setItems(data.items);
            setTotal(data.total);
            setError(null);
        } catch (err) {
            setItems([]);
            setTotal(0);
            setError(getEnviosErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [filters, pageIndex, pageSize]);

    useEffect(() => {
        void fetchHistory();
    }, [fetchHistory]);

    const updateFilters = useCallback((patch: Partial<QuoteHistoryFilters>) => {
        setFilters((previous) => ({ ...previous, ...patch }));
        setPageIndex(0);
    }, []);

    const changePageSize = useCallback((size: number) => {
        setPageSize(size);
        setPageIndex(0);
    }, []);

    return {
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
        refresh: fetchHistory,
    };
};
