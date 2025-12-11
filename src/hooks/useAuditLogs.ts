import { useState, useEffect, useCallback } from 'react';
import { getAuditLogs } from '../services/AuditLogs';
import type { AuditLog } from '../types';

export const useAuditLogs = () => {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAuditLogs = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAuditLogs();
            setAuditLogs(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching audit logs:", err);
            setError("Error al cargar el historial de auditoría");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAuditLogs();
    }, [fetchAuditLogs]);

    return {
        auditLogs,
        loading,
        error,
        fetchAuditLogs
    };
};
