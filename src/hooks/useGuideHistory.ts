import { useCallback, useEffect, useState } from 'react';

import { getGuideHistory } from '../services/Envios';
import { getEnviosErrorMessage } from '../utils/envios';
import type {
    EnviosCarrier,
    GuideHistoryItem,
    GuideState,
} from '../types';

export interface GuideHistoryFilters {
    estado: GuideState | '';
    transportadora: EnviosCarrier | '';
    numeroGuia: string;
}

const initialFilters: GuideHistoryFilters = {
    estado: '',
    transportadora: '',
    numeroGuia: '',
};

export const useGuideHistory = () => {
    const [items, setItems] = useState<GuideHistoryItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState<GuideHistoryFilters>(initialFilters);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getGuideHistory({
                limit: pageSize,
                offset: pageIndex * pageSize,
                estado: filters.estado || undefined,
                transportadora: filters.transportadora || undefined,
                numero_guia: filters.numeroGuia.trim() || undefined,
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

    const updateFilters = useCallback((patch: Partial<GuideHistoryFilters>) => {
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
