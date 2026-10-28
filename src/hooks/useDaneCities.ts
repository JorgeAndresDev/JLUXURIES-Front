import { useEffect, useState } from 'react';

import { searchCities } from '../services/Envios';
import { getEnviosErrorMessage } from '../utils/envios';
import type { DaneCity } from '../types';

export const useDaneCities = (query: string, limit = 30) => {
    const [cities, setCities] = useState<DaneCity[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        setLoading(true);
        setError(null);

        const timer = window.setTimeout(async () => {
            try {
                const data = await searchCities(
                    query.trim(),
                    limit,
                    controller.signal,
                );
                if (!active) return;
                setCities(data.ciudades);
            } catch (err) {
                if (!active || controller.signal.aborted) return;
                setCities([]);
                setError(getEnviosErrorMessage(err));
            } finally {
                if (active) setLoading(false);
            }
        }, 250);

        return () => {
            active = false;
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [query, limit]);

    return { cities, loading, error };
};
