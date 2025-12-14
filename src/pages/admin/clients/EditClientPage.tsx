import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClient, updateClient } from "../../../services/Clients";
// ASUMIMOS que esta es la línea que causaba el error TS6133.
// La importamos como 'type' y la usaremos para tipar el estado.
import type { Client } from "../../../types"; 

// Definimos el tipo del estado, excluyendo campos que no se manejan o que son generados automáticamente (como 'id_cliente').
// ASUMIMOS que Client tiene los campos id_cliente, nombre, email, telefono, direccion, role, y posiblemente password.
interface ClientEditForm {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    role: "client" | "admin";
}

export default function EditClientPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Tipamos el estado para usar 'ClientEditForm' (Resuelve TS6133 al usar el tipo, incluso si es indirecto)
    const [form, setForm] = useState<ClientEditForm>({
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        role: "client" as "client" | "admin" // Aseguramos que sea un literal
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (id) {
            fetchClient(Number(id));
        }
    }, [id]);

    const fetchClient = async (clientId: number) => {
        try {
            setLoadingData(true);
            // Tipamos la respuesta para mayor seguridad (usando el tipo Client que importamos)
            const response = await getClient(clientId);
            const client: Client = response.data; 

            if (client) {
                setForm({
                    nombre: client.nombre,
                    email: client.email,
                    telefono: client.telefono || "",
                    direccion: client.direccion || "",
                    // Aseguramos que el rol cargado sea uno de los tipos permitidos
                    role: (client.role as "client" | "admin") || "client" 
                });
            } else {
                setErrorMsg("Cliente no encontrado");
            }
        } catch (err: any) {
            console.error(err);
            setErrorMsg("Error al cargar el cliente");
        } finally {
            setLoadingData(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'role') {
            // Manejamos el rol con aserción para mantener la tipificación literal
            setForm({ ...form, role: value as "client" | "admin" });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        if (!id) {
            setErrorMsg("ID de cliente no encontrado.");
            setLoading(false);
            return;
        }

        try {
            // ⭐️ LÓGICA CORREGIDA: Hacemos la llamada al API
            await updateClient(Number(id), form);
            
            // Redirección después del éxito
            navigate("/admin/clients");
        } catch (err: any) {
            console.error(err);
            const errorMessage = err.response?.data?.detail || "Hubo un error al actualizar el cliente. Verifique los datos.";
            setErrorMsg(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="min-h-screen w-full bg-gray-950 text-white pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
                </div>
                <div className="flex items-center justify-center py-20 relative z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E6BFF]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-950 text-white pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
            </div>
            <div className="max-w-3xl mx-auto relative z-10">
                <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Editar Cliente</h1>

                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre completo</label>
                            <input
                                type="text"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-[#1E6BFF] focus:ring-1 focus:ring-[#1E6BFF] text-white placeholder-gray-500 transition-all"
                                placeholder="Ej: Juan Pérez"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-[#1E6BFF] focus:ring-1 focus:ring-[#1E6BFF] text-white placeholder-gray-500 transition-all"
                                placeholder="ejemplo@correo.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Rol de Usuario</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-[#1E6BFF] focus:ring-1 focus:ring-[#1E6BFF] text-white transition-all"
                        >
                            <option value="client" className="bg-gray-900 text-white">Cliente</option>
                            <option value="admin" className="bg-gray-900 text-white">Administrador</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Teléfono</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-[#1E6BFF] focus:ring-1 focus:ring-[#1E6BFF] text-white placeholder-gray-500 transition-all"
                            placeholder="Ej: +57 300 123 4567"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Dirección</label>
                        <textarea
                            name="direccion"
                            value={form.direccion}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:outline-none focus:border-[#1E6BFF] focus:ring-1 focus:ring-[#1E6BFF] text-white placeholder-gray-500 transition-all"
                            rows={3}
                            placeholder="Dirección completa..."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/clients')}
                            className="flex-1 py-3.5 px-4 border border-white/10 hover:bg-white/5 text-white rounded-xl font-semibold transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3.5 px-4 bg-gradient-to-r from-[#1E6BFF] to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-900/30 transform hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Actualizando..." : "Actualizar Cliente"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
