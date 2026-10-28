import { useCallback, useEffect, useState } from 'react';

import { getEnviosBranch, getEnviosStatus } from '../services/Envios';
import { getEnviosErrorMessage } from '../utils/envios';
import type { EnviosBranch, EnviosStatus } from '../types';

const loadEnviosStatus = async () => {
    const [statusResult, branchResult] = await Promise.allSettled([
        getEnviosStatus(),
        getEnviosBranch(),
    ]);

    const failed = statusResult.status === 'rejected'
        ? statusResult.reason
        : branchResult.status === 'rejected'
            ? branchResult.reason
            : null;

    return {
        status: statusResult.status === 'fulfilled' ? statusResult.value : null,
        branch: branchResult.status === 'fulfilled' ? branchResult.value : null,
        error: failed ? getEnviosErrorMessage(failed) : null,
    };
};

export const useEnviosStatus = () => {
    const [status, setStatus] = useState<EnviosStatus | null>(null);
    const [branch, setBranch] = useState<EnviosBranch | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        void loadEnviosStatus().then((result) => {
            if (!active) return;
            setStatus(result.status);
            setBranch(result.branch);
            setError(result.error);
            setLoading(false);
        });

        return () => {
            active = false;
        };
    }, []);

    const refresh = useCallback(async () => {
        setLoading(true);
        const result = await loadEnviosStatus();
        setStatus(result.status);
        setBranch(result.branch);
        setError(result.error);
        setLoading(false);
    }, []);

    return {
        status,
        branch,
        loading,
        error,
        refresh,
    };
};
