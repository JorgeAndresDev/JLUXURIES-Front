import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClient, updateClient } from "../../../services/Clients";

export default function EditClientPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [form, setForm] = useState({
        nombre: "",
        email: "",
        telefono: "",
        direccion: "",
        role: "client"
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        fetchClient();
    }, [id]);

    const fetchClient = async () => {
        try {
            setLoadingData(true);
            const response = await getClient(Number(id));
            const client = response.data;

            if (client) {
                setForm({
                    nombre: client.nombre,
                    email: client.email,
                    telefono: client.telefono || "",
                    direccion: client.direccion || "",
                    role: client.role || "client"
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
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg("");

        try {

            await updateClient(Number(id), form as any);
            navigate("/admin/clients");
        } catch (err: any) {
            console.error(err);
            setErrorMsg("Hubo un error al actualizar el cliente. Verifique los datos.");
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
                </div>
                <div className="flex items-center justify-center py-20 relative z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-[#1E6BFF]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
            </div>
            <div className="max-w-3xl mx-auto relative z-10">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">Editar Cliente</h1>

                {errorMsg && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 p-8 rounded-2xl shadow-xl dark:shadow-none">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre completo</label>
                            <input
                                type="text"
                                name="nombre"
                                value={form.nombre}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                                placeholder="Ej: Juan Pérez"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                                placeholder="ejemplo@correo.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Rol de Usuario</label>
                        <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white transition-all"
                        >
                            <option value="client" className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">Cliente</option>
                            <option value="admin" className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">Administrador</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Teléfono</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                            placeholder="Ej: +57 300 123 4567"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Dirección</label>
                        <textarea
                            name="direccion"
                            value={form.direccion}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-[#1E6BFF] focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#1E6BFF] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                            rows={3}
                            placeholder="Dirección completa..."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/clients')}
                            className="flex-1 py-3.5 px-4 border border-gray-300 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-white rounded-xl font-semibold transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3.5 px-4 bg-blue-600 dark:bg-gradient-to-r dark:from-[#1E6BFF] dark:to-blue-700 hover:bg-blue-700 dark:hover:from-blue-600 dark:hover:to-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-900/30 transform hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Actualizando..." : "Actualizar Cliente"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


