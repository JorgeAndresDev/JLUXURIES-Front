import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getClient } from "../../../services/Clients";
import type { Client } from "../../../types";

export default function ClientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [client, setClient] = useState<Client | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchClient();
    }, [id]);

    const fetchClient = async () => {
        try {
            setLoading(true);
            const response = await getClient(Number(id));
            setClient(response.data);
        } catch (err: any) {
            console.error(err);
            setError("Error al cargar el cliente");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E6BFF]"></div>
                </div>
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl mb-6">
                        <p className="text-lg font-semibold">{error || "Cliente no encontrado"}</p>
                    </div>
                    <Link
                        to="/admin/clients"
                        className="inline-flex items-center gap-2 text-[#1E6BFF] hover:text-blue-400 font-semibold"
                    >
                        ← Volver a clientes
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 pt-24 pb-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/admin/clients"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Volver a clientes
                    </Link>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Detalles del Cliente</h1>
                </div>

                {/* Client Card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                    <div className="p-8">
                        {/* Avatar and Name */}
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10">
                            <div className="h-24 w-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg ring-4 ring-white/10">
                                {client.nombre.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">{client.nombre}</h2>
                                <p className="text-gray-400 text-lg">{client.email}</p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <p className="text-sm text-gray-400 mb-2">ID del Cliente</p>
                                <p className="text-lg font-mono text-gray-300">#{client.id_cliente}</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <p className="text-sm text-gray-400 mb-2">Email</p>
                                <p className="text-lg font-semibold text-white break-all">{client.email}</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <p className="text-sm text-gray-400 mb-2">Teléfono</p>
                                <p className="text-lg font-semibold text-white">{client.telefono || "No registrado"}</p>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                <p className="text-sm text-gray-400 mb-2">Dirección</p>
                                <p className="text-lg font-semibold text-white">{client.direccion || "No registrada"}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Link
                                to={`/admin/edit-client/${client.id_cliente}`}
                                className="flex-1 py-3.5 px-4 bg-gradient-to-r from-[#1E6BFF] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-900/30 transform hover:scale-[1.02] transition-all text-center"
                            >
                                Editar Cliente
                            </Link>
                            <button
                                onClick={() => navigate("/admin/clients")}
                                className="px-6 py-3.5 border border-white/10 hover:bg-white/5 text-white rounded-xl font-semibold transition-all"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
