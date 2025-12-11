import { useState, useEffect, useCallback } from 'react';
import { getAllClients, deleteClient as deleteClientService } from '../services/Clients';
import type { Client } from '../types';

export const useClients = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClients = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllClients();
            setClients(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching clients:", err);
            setError("Error al cargar los clientes");
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteClient = useCallback(async (id: number) => {
        try {
            await deleteClientService(id);
            setClients(prev => prev.filter(c => c.id_cliente !== id));
            return true;
        } catch (err) {
            console.error("Error deleting client:", err);
            return false;
        }
    }, []);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    return {
        clients,
        loading,
        error,
        fetchClients,
        deleteClient
    };
};
