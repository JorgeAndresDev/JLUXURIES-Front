import api from '../api/axios';
import type { Client } from '../types';

// Crear nuevo cliente (requiere token)
export const createClient = async (clientData: Client) => {
    return await api.post('/client/create', clientData);
};

// Obtener cliente por ID (requiere token)
export const getClient = async (id: number) => {
    return await api.get(`/client/get_client/${id}`);
};

// Obtener todos los clientes (requiere token)
export const getAllClients = async () => {
    return await api.get('/client/get_all_client');
};

// Actualizar cliente (requiere token)
export const updateClient = async (id: number, clientData: Client) => {
    return await api.put(`/client/update_client/${id}`, clientData);
};

// Eliminar cliente (requiere token)
export const deleteClient = async (id: number) => {
    return await api.delete(`/client/delete_client/${id}`);
};
